"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObject = exports.absolute = void 0;
const path_1 = require("path");
const absolute = (base, rel) => {
    const st = base.split(path_1.sep);
    const arr = rel.split(path_1.sep);
    st.pop();
    for (const el of arr) {
        if (el === ".")
            continue;
        if (el === "..")
            st.pop();
        else
            st.push(el);
    }
    return st.join(path_1.sep);
};
exports.absolute = absolute;
const parseObject = (object = {}) => {
    if (!object || typeof object !== "object")
        return { key: undefined, value: undefined };
    return {
        key: Object.keys(object)[0],
        value: object[Object.keys(object)[0]]
    };
};
exports.parseObject = parseObject;
//# sourceMappingURL=index.js.map