import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateExistingPayments1734278600000 implements MigrationInterface {
  name = 'MigrateExistingPayments1734278600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migrar pagos existentes desde metodoPago legacy a venta_pagos normalizada
    await queryRunner.query(`
      INSERT INTO venta_pagos (
        "ventaId", 
        "metodoPago", 
        monto, 
        referencia, 
        estado, 
        "registradoPor", 
        "fechaRegistro", 
        secuencia
      )
      SELECT 
        v.id as "ventaId",
        v."metodoPago" as "metodoPago",
        v.total as monto,
        CASE 
          WHEN v."metodoPago" = 'YAPE' THEN 'Migración automática - Yape'
          WHEN v."metodoPago" = 'PLIN' THEN 'Migración automática - Plin'
          WHEN v."metodoPago" = 'TARJETA' THEN 'Migración automática - Tarjeta'
          ELSE NULL
        END as referencia,
        'COMPLETADO' as estado,
        COALESCE(v.cajero, 'SISTEMA_MIGRACION') as "registradoPor",
        COALESCE(v.fecha, CURRENT_TIMESTAMP) as "fechaRegistro",
        1 as secuencia
      FROM ventas v
      WHERE v.estado = 'COMPLETADO'
        AND v."metodoPago" IS NOT NULL
        AND v.total > 0
        AND NOT EXISTS (
          SELECT 1 FROM venta_pagos vp WHERE vp."ventaId" = v.id
        )
      ORDER BY v.id
    `);

    // Migrar pagos múltiples desde metodosPageoUsados JSONB (si existen)
    await queryRunner.query(`
      INSERT INTO venta_pagos (
        "ventaId", 
        "metodoPago", 
        monto, 
        referencia, 
        estado, 
        "registradoPor", 
        "fechaRegistro", 
        secuencia
      )
      SELECT 
        v.id as "ventaId",
        (jsonb_array_elements(v."metodosPageoUsados")->>'metodoPago')::ventas_metodopago_enum as "metodoPago",
        ((jsonb_array_elements(v."metodosPageoUsados")->>'monto')::decimal) as monto,
        (jsonb_array_elements(v."metodosPageoUsados")->>'referencia')::varchar as referencia,
        'COMPLETADO' as estado,
        COALESCE(v.cajero, 'SISTEMA_MIGRACION') as "registradoPor",
        COALESCE(v.fecha, CURRENT_TIMESTAMP) as "fechaRegistro",
        ROW_NUMBER() OVER (PARTITION BY v.id ORDER BY v.id) as secuencia
      FROM ventas v
      WHERE v.estado = 'COMPLETADO'
        AND v."metodosPageoUsados" IS NOT NULL
        AND jsonb_array_length(v."metodosPageoUsados") > 0
        AND NOT EXISTS (
          SELECT 1 FROM venta_pagos vp WHERE vp."ventaId" = v.id
        )
      ORDER BY v.id
    `);

    // Actualizar estadísticas de migración
    await queryRunner.query(`
      DO $$
      DECLARE
        total_ventas INTEGER;
        ventas_migradas INTEGER;
        pagos_creados INTEGER;
      BEGIN
        SELECT COUNT(*) INTO total_ventas FROM ventas WHERE estado = 'COMPLETADO';
        SELECT COUNT(DISTINCT "ventaId") INTO ventas_migradas FROM venta_pagos;
        SELECT COUNT(*) INTO pagos_creados FROM venta_pagos;
        
        RAISE NOTICE 'MIGRACIÓN COMPLETADA:';
        RAISE NOTICE '- Total ventas completadas: %', total_ventas;
        RAISE NOTICE '- Ventas con pagos migrados: %', ventas_migradas;
        RAISE NOTICE '- Total registros de pago creados: %', pagos_creados;
        RAISE NOTICE '- Cobertura de migración: %%%', ROUND((ventas_migradas::decimal / NULLIF(total_ventas, 0)) * 100, 2);
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar todos los registros de pagos migrados
    await queryRunner.query(`
      DELETE FROM venta_pagos 
      WHERE "registradoPor" = 'SISTEMA_MIGRACION'
    `);

    // Mostrar estadísticas de rollback
    await queryRunner.query(`
      DO $$
      DECLARE
        pagos_restantes INTEGER;
      BEGIN
        SELECT COUNT(*) INTO pagos_restantes FROM venta_pagos;
        RAISE NOTICE 'ROLLBACK COMPLETADO:';
        RAISE NOTICE '- Registros de pago restantes: %', pagos_restantes;
      END $$;
    `);
  }
}

