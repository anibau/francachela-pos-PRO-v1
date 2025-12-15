import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVentaNewFields1734278500000 implements MigrationInterface {
  name = 'AddVentaNewFields1734278500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar campo recargoExtra a tabla ventas
    await queryRunner.addColumn(
      'ventas',
      new TableColumn({
        name: 'recargoExtra',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    // Agregar campo estadoVenta a tabla ventas (si no existe)
    const table = await queryRunner.getTable('ventas');
    const estadoVentaColumn = table.columns.find(column => column.name === 'estadoVenta');
    
    if (!estadoVentaColumn) {
      await queryRunner.addColumn(
        'ventas',
        new TableColumn({
          name: 'estadoVenta',
          type: 'varchar',
          length: '20',
          default: "'COMPLETADO'",
          isNullable: false,
        }),
      );
    }

    // Actualizar fórmula de cálculo de total en comentario
    await queryRunner.query(`
      COMMENT ON COLUMN ventas.total IS 'Total de la venta calculado como: subTotal - descuento + recargoExtra'
    `);

    // Crear índice en recargoExtra para consultas de estadísticas
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS IDX_ventas_recargo_extra ON ventas(recargoExtra) WHERE recargoExtra > 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índice
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_ventas_recargo_extra`);

    // Eliminar comentario
    await queryRunner.query(`COMMENT ON COLUMN ventas.total IS NULL`);

    // Eliminar columnas
    await queryRunner.dropColumn('ventas', 'recargoExtra');
    
    // Solo eliminar estadoVenta si fue creada por esta migración
    const table = await queryRunner.getTable('ventas');
    const estadoVentaColumn = table.columns.find(column => column.name === 'estadoVenta');
    
    if (estadoVentaColumn) {
      await queryRunner.dropColumn('ventas', 'estadoVenta');
    }
  }
}

