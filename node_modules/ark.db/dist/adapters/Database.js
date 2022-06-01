"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const graceful_fs_1 = require("graceful-fs");
const parent_module_1 = __importDefault(require("parent-module"));
const path_1 = require("path");
const Util_1 = require("../Util");
const lodash_1 = require("../Util/lodash");
const Error_1 = require("../Util/Error");
/**
 * @type Database
 */
class Database {
    /**
     * @param {string} [file="arkdb.json"] file
     * @constructor
     */
    constructor(file = "arkdb.json") {
        file = file.endsWith(".json") ? file : `${file}.json`;
        this.dbFilePath =
            file === "arkdb.json" || path_1.isAbsolute(file)
                ? process.cwd() + path_1.sep + file
                : Util_1.absolute(path_1.dirname(parent_module_1.default()) + path_1.sep, file);
        this.cache = {};
        if (graceful_fs_1.existsSync(this.dbFilePath))
            this.cache = this.read();
        else
            graceful_fs_1.writeFileSync(this.dbFilePath, "{}", "utf-8");
    }
    /**
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        return lodash_1.get(this.cache, key);
    }
    /**
     * @param {string} key
     * @returns {any}
     */
    fetch(key) {
        return this.get(key);
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        return lodash_1.has(this.cache, key);
    }
    /**
     * @param {string} key
     * @param {any} value
     * @param {WriteOptions} [options={ write: true, pretty: false }] options
     * @returns {any}
     */
    set(key, value, options = { write: true, pretty: false }) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        if (typeof value !== "boolean" && value !== 0 && !value)
            throw new Error_1.DatabaseError("Please specify a valid value!");
        lodash_1.set(this.cache, key, value);
        if (options.write)
            this.write(options);
        return this.get(key);
    }
    /**
     * @param {WriteOptions} [options={ write: true, pretty: false }] options
     * @returns {void}
     */
    write(options = { write: true, pretty: false }) {
        const str = options.pretty
            ? JSON.stringify(this.cache, null, 2)
            : JSON.stringify(this.cache);
        graceful_fs_1.writeFileSync(this.dbFilePath, str);
    }
    /**
     * @param {string} key
     * @param {WriteOptions} [options={ write: true, pretty: false }] options
     * @returns {boolean}
     */
    delete(key, options = { write: true, pretty: false }) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        lodash_1.unset(this.cache, key);
        if (options.write)
            this.write(options);
        return true;
    }
    /**
     * @param {string} key
     * @param {number} count
     * @param {WriteOptions} options
     * @returns {any}
     */
    add(key, count, options) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        if (!count)
            throw new Error_1.DatabaseError("Please specify a valid count!");
        const data = lodash_1.get(this.cache, key) || 0;
        if (isNaN(data))
            throw new Error_1.DatabaseError("Data is not a number!");
        this.set(key, data + count, options);
        return this.get(key);
    }
    /**
     * @param {string} key
     * @param {number} count
     * @param {WriteOptions} options
     * @returns {any}
     */
    subtract(key, count, options) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        if (!count)
            throw new Error_1.DatabaseError("Please specify a valid count!");
        const data = lodash_1.get(this.cache, key) || 0;
        if (isNaN(data))
            throw new Error_1.DatabaseError("Data is not a number");
        this.set(key, data - count, options);
        return this.get(key);
    }
    /**
     * @param {string} key
     * @param {any} el
     * @param {WriteOptions} options
     * @returns {any}
     */
    push(key, el, options) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        if (el !== 0 && !el && typeof el !== "boolean")
            throw new Error_1.DatabaseError("Please specify a valid element to push!");
        const data = lodash_1.get(this.cache, key) || [];
        if (!Array.isArray(data))
            throw new Error_1.DatabaseError("Data is not an array");
        data.push(el);
        this.set(key, data, options);
        return this.get(key);
    }
    /**
     * @param {string} key
     * @param {any} el
     * @param {WriteOptions} options
     * @returns {boolean}
     */
    pull(key, el, options) {
        if (!key)
            throw new Error_1.DatabaseError("Please specify a valid key!");
        if (el !== 0 && !el && typeof el !== "boolean")
            throw new Error_1.DatabaseError("Please specify a valid element to pull!");
        const data = lodash_1.get(this.cache, key) || [];
        if (!Array.isArray(data))
            throw new Error_1.DatabaseError("The data is not a array!");
        const newData = data.filter((x) => x !== el);
        this.set(key, newData, options);
        return this.get(key);
    }
    /**
     * @returns {object}
     */
    all() {
        return this.cache;
    }
    /**
     * @returns {boolean}
     */
    clear() {
        this.cache = {};
        this.write();
        return true;
    }
    /**
     * @returns {object}
     */
    read() {
        return JSON.parse(graceful_fs_1.readFileSync(this.dbFilePath, { encoding: "utf-8" }) || "{}");
    }
    /**
     * @returns {number}
     */
    get _get() {
        const start = Date.now();
        this.get("arkdb");
        return Date.now() - start;
    }
    /**
     * @returns {number}
     */
    get _set() {
        const start = Date.now();
        this.set("arkdb", "arkdb");
        return Date.now() - start;
    }
    /**
     * @returns {object}
     */
    get ping() {
        const read = this._get;
        const write = this._set;
        const average = (read + write) / 2;
        this.delete("arkdb");
        return {
            read: `${read}ms`,
            write: `${write}ms`,
            average: `${average}ms`
        };
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map