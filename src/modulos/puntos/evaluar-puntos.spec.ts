import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EvaluarPuntosDto } from './dto/evaluar-puntos.dto';
import { PuntosService } from './puntos.service';

describe('EvaluarPuntosDto', () => {
  it('acepta precioUnitario en items (caso usuario POS)', async () => {
    const dto = plainToInstance(EvaluarPuntosDto, {
      clienteId: 5,
      items: [{ productoId: 298, cantidad: 1, precioUnitario: 102 }],
      puntosSolicitados: 98,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.items[0].precioUnitario).toBe(102);
  });

  it('acepta items sin precioUnitario (retrocompatibilidad)', async () => {
    const dto = plainToInstance(EvaluarPuntosDto, {
      clienteId: 5,
      items: [{ productoId: 298, cantidad: 1 }],
      puntosSolicitados: 10,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('PuntosService.evaluarPuntos', () => {
  const mockConfig = {
    valorPunto: 0.1,
    limiteCanjePorcentaje: 0.5,
    factorOtorgamiento: 1,
  };

  function buildService(overrides?: {
    clientePuntos?: number;
    productoPrecio?: number;
  }) {
    const clienteRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 5,
        puntosAcumulados: overrides?.clientePuntos ?? 200,
      }),
    };
    const productoRepo = {
      find: jest.fn().mockResolvedValue([
        {
          id: 298,
          productoDescripcion: 'Producto test',
          precio: overrides?.productoPrecio ?? 100,
        },
      ]),
    };
    const puntosConfigService = {
      getConfig: jest.fn().mockResolvedValue(mockConfig),
    };

    const service = new PuntosService(
      clienteRepo as never,
      {} as never,
      productoRepo as never,
      {} as never,
      puntosConfigService as never,
    );

    return service;
  }

  it('usa precioUnitario del ticket: 98 pts × 0.10 = descuento 9.8', async () => {
    const service = buildService({ clientePuntos: 200 });
    const result = await service.evaluarPuntos(
      5,
      [{ productoId: 298, cantidad: 1, precioUnitario: 102 }],
      98,
    );

    expect(result.puntosAceptados).toBe(98);
    expect(result.descuento).toBe(9.8);
    expect(result.detalleProductos[0].precio).toBe(102);
    expect(result.limitePorProductos).toBe(510);
  });

  it('sin precioUnitario usa precio de catálogo', async () => {
    const service = buildService({ clientePuntos: 200, productoPrecio: 100 });
    const result = await service.evaluarPuntos(
      5,
      [{ productoId: 298, cantidad: 1 }],
      50,
    );

    expect(result.detalleProductos[0].precio).toBe(100);
    expect(result.limitePorProductos).toBe(500);
    expect(result.puntosAceptados).toBe(50);
    expect(result.descuento).toBe(5);
  });
});
