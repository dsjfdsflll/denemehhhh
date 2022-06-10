"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const Error_1 = require("../../Util/Error");
const events_1 = require("events");
const mongoose_1 = __importDefault(require("mongoose"));
class Base extends events_1.EventEmitter {
    constructor(mongoConnectURL, options = {}) {
        super();
        if (!mongoConnectURL || !mongoConnectURL.startsWith("mongodb"))
            throw new Error_1.DatabaseError("Please specify a valid Mongo connect URL!");
        if (options && typeof options !== "object")
            throw new Error_1.DatabaseError("Options you specified is not an object!");
        this.mongoURL = mongoConnectURL;
        this.options = options;
        this.connection = this._connect(this.mongoURL);
        this.connection.on("error", (e) => this.emit("error", e));
        this.connection.on("open", () => {
            this.connectedAt = new Date();
            this.emit("connected");
        });
    }
    _connect(mongoURL) {
        if (!mongoURL || !mongoURL.startsWith("mongodb"))
            throw new Error_1.DatabaseError("Please specify a valid Mongo connect URL!");
        this.mongoURL = mongoURL;
        delete this.options.useCreateIndex;
        delete this.options.useNewUrlParser;
        delete this.options.useUnifiedTopology;
        delete this.options.useFindAndModify;
        return mongoose_1.default.createConnection(this.mongoURL, Object.assign(Object.assign({}, this.options), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }));
    }
    _disconnect() {
        this.connectedAt = undefined;
        this.mongoURL = "";
        return this.connection.close(true);
    }
}
exports.Base = Base;
//# sourceMappingURL=Base.js.map