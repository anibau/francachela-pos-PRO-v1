import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
            type: 'enum',
            enum: ['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA'],
            enumName: 'ventas_metodopago_enum',
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
        foreignKeys: [
          {
            columnNames: ['ventaId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ventas',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            columnNames: ['ventaId'],
            name: 'IDX_venta_pagos_venta_id',
          },
          {
            columnNames: ['metodoPago'],
            name: 'IDX_venta_pagos_metodo_pago',
          },
          {
            columnNames: ['estado'],
            name: 'IDX_venta_pagos_estado',
          },
          {
            columnNames: ['fechaRegistro'],
            name: 'IDX_venta_pagos_fecha_registro',
          },
          {
            columnNames: ['metodoPago', 'estado'],
            name: 'IDX_venta_pagos_metodo_estado',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tabla (cascada automática elimina foreign keys)
    await queryRunner.dropTable('venta_pagos', true);
  }
}

