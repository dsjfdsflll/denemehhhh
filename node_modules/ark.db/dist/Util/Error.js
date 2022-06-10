"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const chalk_1 = __importDefault(require("chalk"));
class DatabaseError extends Error {
	constructor(message) {
		super(
			chalk_1.default.red(
				message +
					" If you can't solve the problem, https://discord.gg/UEPcFtytcc"
			)
		);
		this.name = "DatabaseError";
	}
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=Error.js.map
