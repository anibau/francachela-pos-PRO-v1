import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAjusteRedondeoToVenta1734883200000 implements MigrationInterface {
  name = 'AddAjusteRedondeoToVenta1734883200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna ajusteRedondeo a la tabla ventas
    await queryRunner.addColumn(
      'ventas',
      new TableColumn({
        name: 'ajusteRedondeo',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        comment: 'Diferencia contable entre total calculado y monto efectivamente cobrado',
      }),
    );

    // Actualizar ventas existentes: calcular ajusteRedondeo basado en la diferencia
    // entre montoRecibido y total para mantener consistencia histórica
    await queryRunner.query(`
      UPDATE ventas 
      SET "ajusteRedondeo" = ROUND(("montoRecibido" - "total")::numeric, 2)
      WHERE "estado" = 'COMPLETADO' 
      AND "montoRecibido" > 0 
      AND ABS("montoRecibido" - "total") <= 0.05
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columna ajusteRedondeo
    await queryRunner.dropColumn('ventas', 'ajusteRedondeo');
  }
}
