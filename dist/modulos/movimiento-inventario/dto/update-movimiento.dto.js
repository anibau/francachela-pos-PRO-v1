"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovimientoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_movimiento_dto_1 = require("./create-movimiento.dto");
class UpdateMovimientoDto extends (0, swagger_1.PartialType)(create_movimiento_dto_1.CreateMovimientoDto) {
}
exports.UpdateMovimientoDto = UpdateMovimientoDto;
//# sourceMappingURL=update-movimiento.dto.js.map