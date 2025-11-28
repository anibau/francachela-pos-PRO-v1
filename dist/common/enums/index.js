"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoMovimiento = exports.CategoriaGasto = exports.EstadoCaja = exports.MetodoPago = exports.TipoCompra = exports.EstadoVenta = exports.UserRole = exports.TipoPromocion = exports.EstadoDelivery = void 0;
var EstadoDelivery;
(function (EstadoDelivery) {
    EstadoDelivery["PENDIENTE"] = "PENDIENTE";
    EstadoDelivery["ASIGNADO"] = "ASIGNADO";
    EstadoDelivery["EN_CAMINO"] = "EN_CAMINO";
    EstadoDelivery["ENTREGADO"] = "ENTREGADO";
    EstadoDelivery["CANCELADO"] = "CANCELADO";
})(EstadoDelivery || (exports.EstadoDelivery = EstadoDelivery = {}));
var TipoPromocion;
(function (TipoPromocion) {
    TipoPromocion["PORCENTAJE"] = "PORCENTAJE";
    TipoPromocion["MONTO"] = "MONTO";
    TipoPromocion["DOS_POR_UNO"] = "2X1";
    TipoPromocion["TRES_POR_DOS"] = "3X2";
})(TipoPromocion || (exports.TipoPromocion = TipoPromocion = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAJERO"] = "CAJERO";
    UserRole["INVENTARIOS"] = "INVENTARIOS";
})(UserRole || (exports.UserRole = UserRole = {}));
var EstadoVenta;
(function (EstadoVenta) {
    EstadoVenta["COMPLETADO"] = "COMPLETADO";
    EstadoVenta["ANULADO"] = "ANULADO";
    EstadoVenta["PENDIENTE"] = "PENDIENTE";
})(EstadoVenta || (exports.EstadoVenta = EstadoVenta = {}));
var TipoCompra;
(function (TipoCompra) {
    TipoCompra["LOCAL"] = "LOCAL";
    TipoCompra["DELIVERY"] = "DELIVERY";
})(TipoCompra || (exports.TipoCompra = TipoCompra = {}));
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "EFECTIVO";
    MetodoPago["YAPE"] = "YAPE";
    MetodoPago["PLIN"] = "PLIN";
    MetodoPago["TARJETA"] = "TARJETA";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
var EstadoCaja;
(function (EstadoCaja) {
    EstadoCaja["ABIERTA"] = "ABIERTA";
    EstadoCaja["CERRADA"] = "CERRADA";
})(EstadoCaja || (exports.EstadoCaja = EstadoCaja = {}));
var CategoriaGasto;
(function (CategoriaGasto) {
    CategoriaGasto["OPERATIVO"] = "OPERATIVO";
    CategoriaGasto["MARKETING"] = "MARKETING";
    CategoriaGasto["MANTENIMIENTO"] = "MANTENIMIENTO";
    CategoriaGasto["SERVICIOS"] = "SERVICIOS";
    CategoriaGasto["OTROS"] = "OTROS";
})(CategoriaGasto || (exports.CategoriaGasto = CategoriaGasto = {}));
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["ENTRADA"] = "ENTRADA";
    TipoMovimiento["SALIDA"] = "SALIDA";
    TipoMovimiento["AJUSTE"] = "AJUSTE";
    TipoMovimiento["VENTA"] = "VENTA";
    TipoMovimiento["DEVOLUCION"] = "DEVOLUCION";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
//# sourceMappingURL=index.js.map