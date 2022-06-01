"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const lodash_1 = require("../Util/lodash");
const Error_1 = require("../Util/Error");
class LocalStorage {
	constructor() {
		const data = JSON.parse(localStorage.getItem("arkdb"));
		if (!data || typeof data !== "object")
			localStorage.setItem("arkdb", "{}");
		this.data = data || {};
	}
	get(key) {
		return lodash_1.get(this.data, key);
	}
	has(key) {
		return lodash_1.has(this.data, key);
	}
	set(key, value) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		if (!value)
			throw new Error_1.DatabaseError("Please specify a valid value!");
		lodash_1.set(this.data, key, value);
		this.write();
		return this.get(key);
	}
	write() {
		localStorage.setItem("arkdb", JSON.stringify(this.data));
	}
	delete(key) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		lodash_1.unset(this.data, key);
		this.write();
		return true;
	}
	add(key, count) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		if (!count)
			throw new Error_1.DatabaseError("Please specify a valid count!");
		const data = this.get(key) || 0;
		if (isNaN(data))
			throw new Error_1.DatabaseError("Data is not a number");
		return this.set(key, data + count);
	}
	subtract(key, count) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		if (!count)
			throw new Error_1.DatabaseError("Please specify a valid count!");
		const data = this.get(key) || 0;
		if (isNaN(data))
			throw new Error_1.DatabaseError("Data is not a number");
		return this.set(key, data - count);
	}
	push(key, el) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		if (el !== 0 && !el && typeof el !== "boolean")
			throw new Error_1.DatabaseError(
				"Please specify a valid element to push!"
			);
		const data = this.get(key) || [];
		if (!Array.isArray(data))
			throw new Error_1.DatabaseError("Data is not an array");
		data.push(el);
		return this.set(key, data);
	}
	pull(key, el) {
		if (!key)
			throw new Error_1.DatabaseError("Please specify a valid key!");
		if (!el)
			throw new Error_1.DatabaseError(
				"Please specify a valid element to pull!"
			);
		const data = this.get(key) || [];
		if (!Array.isArray(data))
			throw new Error_1.DatabaseError("The data is not a array!");
		const newData = data.filter((x) => !x.includes(el));
		return this.set(key, newData);
	}
	clear() {
		this.data = {};
		this.write();
		return true;
	}
}
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map
