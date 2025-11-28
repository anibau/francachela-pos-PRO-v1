"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromocionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_promocion_dto_1 = require("./create-promocion.dto");
class UpdatePromocionDto extends (0, swagger_1.PartialType)(create_promocion_dto_1.CreatePromocionDto) {
}
exports.UpdatePromocionDto = UpdatePromocionDto;
//# sourceMappingURL=update-promocion.dto.js.map