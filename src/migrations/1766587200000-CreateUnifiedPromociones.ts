import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateUnifiedPromociones1766587200000 implements MigrationInterface {
  name = 'CreateUnifiedPromociones1766587200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear enum para tipo de promoción
    await queryRunner.query(`
      CREATE TYPE "tipo_promocion_enum" AS ENUM('SIMPLE', 'PACK', 'COMBO')
    `);

    // Crear enum para tipo de descuento
    await queryRunner.query(`
      CREATE TYPE "tipo_descuento_enum" AS ENUM('PORCENTAJE', 'MONTO_FIJO', 'PRECIO_FIJO')
    `);

    // Crear tabla promociones unificada
    await queryRunner.createTable(
      new Table({
        name: 'promociones_unificadas',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tipo_promocion',
            type: 'tipo_promocion_enum',
            isNullable: false,
            comment: 'SIMPLE: descuento individual, PACK: cantidad específica, COMBO: precio fijo conjunto',
          },
          {
            name: 'tipo_descuento',
            type: 'tipo_descuento_enum',
            isNullable: false,
            comment: 'PORCENTAJE: %, MONTO_FIJO: cantidad fija, PRECIO_FIJO: precio total',
          },
          {
            name: 'descuento',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
            comment: 'Valor del descuento (porcentaje o monto según tipoDescuento)',
          },
          {
            name: 'precio_combo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Precio fijo para COMBO (solo cuando tipoDescuento = PRECIO_FIJO)',
          },
          {
            name: 'fecha_inicio',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'fecha_fin',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'max_usos',
            type: 'int',
            isNullable: true,
            comment: 'Límite máximo de usos de la promoción',
          },
          {
            name: 'usos_actuales',
            type: 'int',
            default: 0,
            comment: 'Contador de usos actuales',
          },
          {
            name: 'activo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'puntos_extra',
            type: 'int',
            default: 0,
            comment: 'Puntos extra otorgados por esta promoción',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Crear tabla de relación promocion_productos
    await queryRunner.createTable(
      new Table({
        name: 'promocion_productos',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'promocion_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'producto_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'cantidad_exacta',
            type: 'int',
            isNullable: true,
            comment: 'Cantidad exacta requerida para PACK y COMBO',
          },
          {
            name: 'cantidad_minima',
            type: 'int',
            isNullable: true,
            comment: 'Cantidad mínima requerida para SIMPLE',
          },
          {
            name: 'obligatorio',
            type: 'boolean',
            default: true,
            comment: 'Si es obligatorio para que aplique la promoción (usado en COMBO)',
          },
        ],
      }),
      true,
    );

    // Crear índices
    await queryRunner.createIndex(
      'promociones_unificadas',
      new Index('IDX_promociones_unificadas_activo', ['activo']),
    );

    await queryRunner.createIndex(
      'promociones_unificadas',
      new Index('IDX_promociones_unificadas_fechas', ['fecha_inicio', 'fecha_fin']),
    );

    await queryRunner.createIndex(
      'promociones_unificadas',
      new Index('IDX_promociones_unificadas_tipo', ['tipo_promocion']),
    );

    await queryRunner.createIndex(
      'promocion_productos',
      new Index('IDX_promocion_productos_promocion', ['promocion_id']),
    );

    await queryRunner.createIndex(
      'promocion_productos',
      new Index('IDX_promocion_productos_producto', ['producto_id']),
    );

    // Crear foreign keys
    await queryRunner.createForeignKey(
      'promocion_productos',
      new ForeignKey({
        columnNames: ['promocion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promociones_unificadas',
        onDelete: 'CASCADE',
        name: 'FK_promocion_productos_promocion',
      }),
    );

    await queryRunner.createForeignKey(
      'promocion_productos',
      new ForeignKey({
        columnNames: ['producto_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'productos',
        onDelete: 'CASCADE',
        name: 'FK_promocion_productos_producto',
      }),
    );

    // Migrar datos existentes de combos a promociones unificadas
    await this.migrarCombosExistentes(queryRunner);

    // Migrar datos existentes de promociones a promociones unificadas
    await this.migrarPromocionesExistentes(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    await queryRunner.dropForeignKey('promocion_productos', 'FK_promocion_productos_promocion');
    await queryRunner.dropForeignKey('promocion_productos', 'FK_promocion_productos_producto');

    // Eliminar índices
    await queryRunner.dropIndex('promociones_unificadas', 'IDX_promociones_unificadas_activo');
    await queryRunner.dropIndex('promociones_unificadas', 'IDX_promociones_unificadas_fechas');
    await queryRunner.dropIndex('promociones_unificadas', 'IDX_promociones_unificadas_tipo');
    await queryRunner.dropIndex('promocion_productos', 'IDX_promocion_productos_promocion');
    await queryRunner.dropIndex('promocion_productos', 'IDX_promocion_productos_producto');

    // Eliminar tablas
    await queryRunner.dropTable('promocion_productos');
    await queryRunner.dropTable('promociones_unificadas');

    // Eliminar enums
    await queryRunner.query(`DROP TYPE "tipo_descuento_enum"`);
    await queryRunner.query(`DROP TYPE "tipo_promocion_enum"`);
  }

  private async migrarCombosExistentes(queryRunner: QueryRunner): Promise<void> {
    // Verificar si existe la tabla combos
    const combosExist = await queryRunner.hasTable('combos');
    if (!combosExist) {
      console.log('Tabla combos no existe, saltando migración de combos');
      return;
    }

    // Obtener combos existentes
    const combos = await queryRunner.query(`
      SELECT * FROM combos WHERE activo = true
    `);

    for (const combo of combos) {
      // Insertar combo como promoción COMBO con PRECIO_FIJO
      const [promocionResult] = await queryRunner.query(`
        INSERT INTO promociones_unificadas 
        (nombre, descripcion, tipo_promocion, tipo_descuento, descuento, precio_combo, 
         fecha_inicio, fecha_fin, activo, puntos_extra, created_at, updated_at)
        VALUES ($1, $2, 'COMBO', 'PRECIO_FIJO', $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        combo.nombre,
        combo.descripcion,
        0, // descuento = 0 para PRECIO_FIJO
        combo.precioCombo,
        combo.fechaInicio || new Date(),
        combo.fechaFin || new Date('2025-12-31'),
        combo.activo,
        combo.puntosExtra || 0,
        combo.fechaCreacion || new Date(),
        combo.fechaActualizacion || new Date(),
      ]);

      const promocionId = promocionResult.id;

      // Migrar productos del combo (desde JSONB)
      if (combo.productos && Array.isArray(combo.productos)) {
        for (const producto of combo.productos) {
          await queryRunner.query(`
            INSERT INTO promocion_productos 
            (promocion_id, producto_id, cantidad_exacta, obligatorio)
            VALUES ($1, $2, $3, true)
          `, [promocionId, producto.id, producto.cantidad || 1]);
        }
      }
    }

    console.log(`Migrados ${combos.length} combos a promociones unificadas`);
  }

  private async migrarPromocionesExistentes(queryRunner: QueryRunner): Promise<void> {
    // Verificar si existe la tabla promociones
    const promocionesExist = await queryRunner.hasTable('promociones');
    if (!promocionesExist) {
      console.log('Tabla promociones no existe, saltando migración de promociones');
      return;
    }

    // Obtener promociones existentes
    const promociones = await queryRunner.query(`
      SELECT * FROM promociones WHERE activo = true
    `);

    for (const promocion of promociones) {
      // Determinar tipo de promoción y descuento basado en el tipo actual
      let tipoPromocion = 'SIMPLE';
      let tipoDescuento = 'PORCENTAJE';
      
      if (promocion.tipo === 'PORCENTAJE') {
        tipoDescuento = 'PORCENTAJE';
      } else if (promocion.tipo === 'MONTO') {
        tipoDescuento = 'MONTO_FIJO';
      } else if (promocion.tipo === '2X1' || promocion.tipo === '3X2') {
        tipoPromocion = 'PACK';
        tipoDescuento = 'PORCENTAJE';
      }

      // Insertar promoción
      const [promocionResult] = await queryRunner.query(`
        INSERT INTO promociones_unificadas 
        (nombre, descripcion, tipo_promocion, tipo_descuento, descuento, 
         fecha_inicio, fecha_fin, max_usos, usos_actuales, activo, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `, [
        promocion.nombre,
        promocion.descripcion,
        tipoPromocion,
        tipoDescuento,
        promocion.descuento,
        promocion.fechaInicio,
        promocion.fechaFin,
        promocion.cantidadMaximaUsos,
        promocion.cantidadUsada || 0,
        promocion.activo,
        promocion.fechaCreacion || new Date(),
        promocion.fechaActualizacion || new Date(),
      ]);

      const promocionId = promocionResult.id;

      // Migrar productos aplicables (desde JSONB array de IDs)
      if (promocion.productosAplicables && Array.isArray(promocion.productosAplicables)) {
        for (const productoId of promocion.productosAplicables) {
          await queryRunner.query(`
            INSERT INTO promocion_productos 
            (promocion_id, producto_id, cantidad_minima, obligatorio)
            VALUES ($1, $2, $3, false)
          `, [promocionId, productoId, 1]);
        }
      }
    }

    console.log(`Migradas ${promociones.length} promociones a promociones unificadas`);
  }
}
