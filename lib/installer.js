"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFlutter(milliseconds) {
    return new Promise((resolve) => {
        if (isNaN(milliseconds)) {
            throw new Error('milleseconds not a number');
        }
        setTimeout(() => resolve("done!"), milliseconds);
    });
}
exports.getFlutter = getFlutter;
