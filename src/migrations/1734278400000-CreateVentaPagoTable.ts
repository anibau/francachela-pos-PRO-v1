import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateVentaPagoTable1734278400000 implements MigrationInterface {
  name = 'CreateVentaPagoTable1734278400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla venta_pagos
    await queryRunner.createTable(
      new Table({
        name: 'venta_pagos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ventaId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'metodoPago',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'monto',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'referencia',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '20',
            default: "'COMPLETADO'",
            isNullable: false,
          },
          {
            name: 'registradoPor',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'fechaRegistro',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'secuencia',
            type: 'int',
            default: 1,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Crear foreign key hacia tabla ventas
    await queryRunner.createForeignKey(
      'venta_pagos',
      new ForeignKey({
        columnNames: ['ventaId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ventas',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Crear índices para optimizar consultas
    await queryRunner.createIndex(
      'venta_pagos',
      new Index('IDX_venta_pagos_venta_id', ['ventaId']),
    );

    await queryRunner.createIndex(
      'venta_pagos',
      new Index('IDX_venta_pagos_metodo_pago', ['metodoPago']),
    );

    await queryRunner.createIndex(
      'venta_pagos',
      new Index('IDX_venta_pagos_estado', ['estado']),
    );

    await queryRunner.createIndex(
      'venta_pagos',
      new Index('IDX_venta_pagos_fecha_registro', ['fechaRegistro']),
    );

    // Índice compuesto para consultas de estadísticas
    await queryRunner.createIndex(
      'venta_pagos',
      new Index('IDX_venta_pagos_metodo_estado', ['metodoPago', 'estado']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.dropIndex('venta_pagos', 'IDX_venta_pagos_metodo_estado');
    await queryRunner.dropIndex('venta_pagos', 'IDX_venta_pagos_fecha_registro');
    await queryRunner.dropIndex('venta_pagos', 'IDX_venta_pagos_estado');
    await queryRunner.dropIndex('venta_pagos', 'IDX_venta_pagos_metodo_pago');
    await queryRunner.dropIndex('venta_pagos', 'IDX_venta_pagos_venta_id');

    // Eliminar foreign key
    const table = await queryRunner.getTable('venta_pagos');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('ventaId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('venta_pagos', foreignKey);
    }

    // Eliminar tabla
    await queryRunner.dropTable('venta_pagos');
  }
}

