#!/bin/bash

# Script para ejecutar migraciones de la normalización de pagos
# Fase 6 del refactoring crítico del backend

echo "🚀 INICIANDO MIGRACIONES - NORMALIZACIÓN DE PAGOS"
echo "=================================================="

# Verificar que las variables de entorno estén configuradas
if [ -z "$DB_HOST" ] || [ -z "$DB_DATABASE" ] || [ -z "$DB_USERNAME" ]; then
    echo "❌ ERROR: Variables de entorno de base de datos no configuradas"
    echo "   Asegúrate de tener configuradas: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD"
    exit 1
fi

echo "📋 Configuración de base de datos:"
echo "   Host: $DB_HOST"
echo "   Database: $DB_DATABASE"
echo "   Username: $DB_USERNAME"
echo ""

# Función para ejecutar migración con validación
run_migration() {
    local migration_name=$1
    echo "🔄 Ejecutando migración: $migration_name"
    
    if npm run typeorm:migration:run -- --migration="$migration_name"; then
        echo "✅ Migración $migration_name completada exitosamente"
    else
        echo "❌ ERROR: Falló la migración $migration_name"
        echo "   Revisa los logs para más detalles"
        exit 1
    fi
    echo ""
}

# Función para verificar estado de la base de datos
check_database_status() {
    echo "🔍 Verificando estado de la base de datos..."
    
    # Verificar que la tabla ventas existe
    if npm run typeorm:query -- "SELECT COUNT(*) FROM ventas LIMIT 1" > /dev/null 2>&1; then
        echo "✅ Tabla 'ventas' encontrada"
    else
        echo "❌ ERROR: Tabla 'ventas' no encontrada"
        echo "   Asegúrate de que la base de datos esté inicializada"
        exit 1
    fi
    
    # Contar ventas existentes
    local venta_count=$(npm run typeorm:query -- "SELECT COUNT(*) as count FROM ventas" 2>/dev/null | grep -o '[0-9]\+' | tail -1)
    echo "📊 Ventas existentes en la base de datos: $venta_count"
    echo ""
}

# Función para crear backup
create_backup() {
    echo "💾 Creando backup de seguridad..."
    local backup_file="backup_ventas_$(date +%Y%m%d_%H%M%S).sql"
    
    if command -v pg_dump > /dev/null 2>&1; then
        pg_dump -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" \
                -t ventas -t venta_pagos --data-only > "$backup_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Backup creado: $backup_file"
        else
            echo "⚠️  Advertencia: No se pudo crear backup automático"
            echo "   Considera crear un backup manual antes de continuar"
        fi
    else
        echo "⚠️  pg_dump no encontrado - saltando backup automático"
        echo "   Considera crear un backup manual antes de continuar"
    fi
    echo ""
}

# Función para mostrar resumen final
show_summary() {
    echo "📊 RESUMEN DE MIGRACIÓN"
    echo "======================"
    
    # Contar registros en venta_pagos
    local pagos_count=$(npm run typeorm:query -- "SELECT COUNT(*) as count FROM venta_pagos" 2>/dev/null | grep -o '[0-9]\+' | tail -1)
    echo "   Registros en venta_pagos: $pagos_count"
    
    # Contar ventas con pagos normalizados
    local ventas_migradas=$(npm run typeorm:query -- "SELECT COUNT(DISTINCT ventaId) as count FROM venta_pagos" 2>/dev/null | grep -o '[0-9]\+' | tail -1)
    echo "   Ventas con pagos normalizados: $ventas_migradas"
    
    # Mostrar métodos de pago más usados
    echo ""
    echo "🏆 Top métodos de pago:"
    npm run typeorm:query -- "
        SELECT metodoPago, COUNT(*) as cantidad, SUM(monto) as total_monto 
        FROM venta_pagos 
        GROUP BY metodoPago 
        ORDER BY cantidad DESC 
        LIMIT 5
    " 2>/dev/null | tail -n +2
    
    echo ""
    echo "✅ MIGRACIÓN COMPLETADA EXITOSAMENTE"
    echo "   Los endpoints de estadísticas ahora usarán datos normalizados"
    echo "   Rendimiento mejorado para consultas de gran volumen"
}

# EJECUCIÓN PRINCIPAL
echo "⏰ Inicio: $(date)"
echo ""

# Verificar estado inicial
check_database_status

# Crear backup de seguridad
create_backup

# Confirmar ejecución
echo "⚠️  IMPORTANTE: Esta migración modificará la estructura de la base de datos"
echo "   ¿Deseas continuar? (y/N)"
read -r confirmation

if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo "❌ Migración cancelada por el usuario"
    exit 0
fi

echo ""
echo "🚀 Iniciando proceso de migración..."
echo ""

# Ejecutar migraciones en orden
run_migration "CreateVentaPagoTable1734278400000"
run_migration "AddVentaNewFields1734278500000"
run_migration "MigrateExistingPayments1734278600000"

# Mostrar resumen
show_summary

echo ""
echo "⏰ Finalización: $(date)"
echo "🎉 ¡Proceso completado exitosamente!"

