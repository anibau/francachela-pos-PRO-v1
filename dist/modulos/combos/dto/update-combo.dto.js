"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComboDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_combo_dto_1 = require("./create-combo.dto");
class UpdateComboDto extends (0, swagger_1.PartialType)(create_combo_dto_1.CreateComboDto) {
}
exports.UpdateComboDto = UpdateComboDto;
//# sourceMappingURL=update-combo.dto.js.map