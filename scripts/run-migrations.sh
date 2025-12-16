#!/bin/bash

echo "🚀 INICIANDO MIGRACIONES - NORMALIZACIÓN DE PAGOS"
echo "=================================================="

# =========================
# VALIDAR VARIABLES DE ENTORNO
# =========================
if [ -z "$DB_HOST" ] || [ -z "$DB_DATABASE" ] || [ -z "$DB_USERNAME" ]; then
  echo "❌ ERROR: Variables de entorno no configuradas"
  echo "   Requiere: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD"
  exit 1
fi

echo "📋 Configuración:"
echo "   Host: $DB_HOST"
echo "   Database: $DB_DATABASE"
echo "   Username: $DB_USERNAME"
echo ""

# =========================
# VERIFICAR BD (FORMA CORRECTA)
# =========================
check_database_status() {
  echo "🔍 Verificando estado de la base de datos..."

  result=$(npm run typeorm:query -- "SELECT to_regclass('public.ventas')" 2>/dev/null)

  if echo "$result" | grep -q "ventas"; then
    echo "✅ Tabla 'ventas' encontrada"
  else
    echo "❌ ERROR: Tabla 'ventas' no encontrada"
    exit 1
  fi

  venta_count=$(npm run typeorm:query -- "SELECT COUNT(*) FROM ventas" 2>/dev/null | grep -Eo '[0-9]+' | tail -1)
  echo "📊 Ventas existentes: $venta_count"
  echo ""
}

# =========================
# BACKUP
# =========================
create_backup() {
  echo "💾 Creando backup..."
  backup_file="backup_ventas_$(date +%Y%m%d_%H%M%S).sql"

  if command -v pg_dump >/dev/null 2>&1; then
    pg_dump -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" \
      -t ventas -t venta_pagos --data-only > "$backup_file" 2>/dev/null

    echo "✅ Backup creado: $backup_file"
  else
    echo "⚠️  pg_dump no encontrado, backup omitido"
  fi

  echo ""
}

# =========================
# EJECUTAR MIGRACIONES
# =========================
run_migration() {
  local name=$1
  echo "🔄 Ejecutando migración: $name"

  npm run migration:run || {
    echo "❌ ERROR en migración: $name"
    exit 1
  }

  echo "✅ Migración aplicada"
  echo ""
}

# =========================
# RESUMEN FINAL
# =========================
show_summary() {
  echo "📊 RESUMEN FINAL"
  echo "================"

  pagos=$(npm run typeorm:query -- "SELECT COUNT(*) FROM venta_pagos" 2>/dev/null | grep -Eo '[0-9]+' | tail -1)
  echo "   Registros en venta_pagos: $pagos"

  echo ""
  echo "🏆 Métodos de pago:"
  npm run typeorm:query -- "
    SELECT metodoPago, COUNT(*) cantidad, SUM(monto) total
    FROM venta_pagos
    GROUP BY metodoPago
    ORDER BY cantidad DESC
  " 2>/dev/null | tail -n +2

  echo ""
  echo "✅ MIGRACIÓN COMPLETADA"
}

# =========================
# EJECUCIÓN PRINCIPAL
# =========================
echo "⏰ Inicio: $(date)"
echo ""

check_database_status
create_backup

echo "⚠️  Esta migración modificará la BD"
read -p "¿Continuar? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ Cancelado por el usuario"
  exit 0
fi

echo ""
echo "🚀 Ejecutando migraciones..."
echo ""

run_migration "CreateVentaPagoTable"
run_migration "AddVentaNewFields"

show_summary

echo ""
echo "⏰ Fin: $(date)"
echo "🎉 Proceso completado"
