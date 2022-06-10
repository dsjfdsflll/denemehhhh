"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DefaultSchema = new mongoose_1.Schema({
    Key: {
        type: String,
        required: true
    },
    Value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    }
});
exports.default = (connection, name) => connection.model(name, DefaultSchema);
//# sourceMappingURL=Schema.js.map