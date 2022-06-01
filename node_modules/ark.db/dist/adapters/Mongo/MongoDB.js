"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const Util_1 = require("../../Util");
const lodash_1 = require("../../Util/lodash");
const Error_1 = require("../../Util/Error");
const Base_1 = require("./Base");
const Schema_1 = __importDefault(require("./Schema"));
class MongoDB extends Base_1.Base {
    constructor(mongoConnectURL, name = "arkdb", options = {}) {
        super(mongoConnectURL, options);
        this.schema = Schema_1.default(this.connection, name);
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            const arr = key.split(".");
            const data = yield this.schema.findOne({ Key: arr[0] });
            if (!data)
                return null;
            if (arr.length > 1) {
                if (data.Value && typeof data.Value === "object")
                    return lodash_1.get(data.Value, arr.slice(1).join("."));
                return null;
            }
            return data.Value;
        });
    }
    fetch(key) {
        return this.get(key);
    }
    has(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            const arr = key.split(".");
            const data = yield this.schema.findOne({ Key: arr[0] });
            if (arr.length > 1) {
                if (data.Value && typeof data.Value === "object")
                    return !!(yield this.get(key));
            }
            else
                return !!data;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            if (!value)
                throw new Error_1.DatabaseError("Please specify a valid value!");
            const parsed = Util_1.parseObject(lodash_1.set({}, key, value));
            return this.schema.findOneAndUpdate({ Key: parsed.key }, { $set: { Value: parsed.value } }, { upsert: true, new: true });
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            const arr = key.split(".");
            const data = yield this.schema.findOne({ Key: arr[0] });
            if (!data)
                return false;
            if (data.Value && typeof data.Value === "object") {
                const newData = lodash_1.unset(data.Value, arr[arr.length - 1]);
                this.schema.findOneAndUpdate({ Key: arr[0] }, { $set: { Value: newData } });
                return true;
            }
            this.schema.deleteOne({ Key: arr[0] });
            return true;
        });
    }
    add(key, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            if (!count)
                throw new Error_1.DatabaseError("Please specify a valid count!");
            const data = (yield this.get(key)) || 0;
            if (isNaN(data))
                throw new Error_1.DatabaseError("Data is not a number!");
            return this.set(key, data + count);
        });
    }
    subtract(key, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            if (!count)
                throw new Error_1.DatabaseError("Please specify a valid count!");
            const data = (yield this.get(key)) || 0;
            if (isNaN(data))
                throw new Error_1.DatabaseError("Data is not a number!");
            return this.set(key, data - count);
        });
    }
    push(key, el) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            if (el !== 0 && !el && typeof el !== "boolean")
                throw new Error_1.DatabaseError("Please specify a valid element!");
            const data = (yield this.get(key)) || [];
            if (!Array.isArray(data))
                throw new Error_1.DatabaseError("Data is not an array!");
            data.push(el);
            return this.set(key, data);
        });
    }
    pull(key, el) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw new Error_1.DatabaseError("Please specify a valid key!");
            if (el !== 0 && !el && typeof el !== "boolean")
                throw new Error_1.DatabaseError("Please specify a valid element to pull!");
            const data = (yield this.get(key)) || [];
            if (!Array.isArray(data))
                throw new Error_1.DatabaseError("The data is not a array!");
            const newData = data.filter((x) => x !== el);
            return this.set(key, newData);
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.find({});
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.deleteMany({});
        });
    }
    uptime() {
        if (!this.connectedAt)
            return 0;
        return Date.now() - this.connectedAt.getTime();
    }
    connect(url) {
        return this._connect(url);
    }
    disconnect() {
        return this._disconnect();
    }
    updateModel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.schema = Schema_1.default(yield this.connection, name);
            return this.schema;
        });
    }
    createModel(name) {
        if (!name)
            throw new Error_1.DatabaseError("Please provide a valid model name!");
        return new MongoDB(this.mongoURL, name, this.options);
    }
    createSchema(name) {
        return this.createModel(name);
    }
    createDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dbName)
                throw new Error_1.DatabaseError("Please provide a valid database name!");
            return new MongoDB(this.mongoURL.replace((yield this.connection).name, dbName), this.schema.modelName, this.options);
        });
    }
    createCollection(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createDatabase(dbName);
        });
    }
    dropDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection).dropDatabase();
        });
    }
    dropCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dropDatabase();
        });
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=MongoDB.js.map