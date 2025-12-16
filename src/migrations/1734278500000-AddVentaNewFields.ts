import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVentaNewFields1734278500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ventas');
    if (!table) return;

    const hasRecargo = table.columns.some(
      column => column.name === 'recargoExtra',
    );

    if (!hasRecargo) {
      await queryRunner.addColumn(
        'ventas',
        new TableColumn({
          name: 'recargoExtra',
          type: 'decimal',
          precision: 10,
          scale: 2,
          default: '0',
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ventas');
    if (!table) return;

    const hasRecargo = table.columns.some(
      column => column.name === 'recargoExtra',
    );

    if (hasRecargo) {
      await queryRunner.dropColumn('ventas', 'recargoExtra');
    }
  }
}
