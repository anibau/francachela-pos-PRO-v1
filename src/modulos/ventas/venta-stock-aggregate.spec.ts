/** Verifica agregación de cantidades por productoId para validación de stock */
function aggregateQty(items: Array<{ productoId: number; cantidad: number }>) {
  const map = new Map<number, number>();
  for (const item of items) {
    map.set(item.productoId, (map.get(item.productoId) || 0) + item.cantidad);
  }
  return map;
}

describe('Stock agregado preview', () => {
  it('suma cantidades duplicadas del mismo productoId', () => {
    const items = [
      { productoId: 80, cantidad: 1 },
      { productoId: 80, cantidad: 1 },
    ];
    const agg = aggregateQty(items);
    expect(agg.get(80)).toBe(2);
  });

  it('stock 2 con total 3 debe fallar validación lógica', () => {
    const stock = 2;
    const totalRequired = aggregateQty([
      { productoId: 1, cantidad: 2 },
      { productoId: 1, cantidad: 1 },
    ]).get(1)!;
    expect(totalRequired).toBe(3);
    expect(stock < totalRequired).toBe(true);
  });
});
