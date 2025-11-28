"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGastoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_gasto_dto_1 = require("./create-gasto.dto");
class UpdateGastoDto extends (0, swagger_1.PartialType)(create_gasto_dto_1.CreateGastoDto) {
}
exports.UpdateGastoDto = UpdateGastoDto;
//# sourceMappingURL=update-gasto.dto.js.map