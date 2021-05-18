"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertUnreachable = void 0;
// See https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-exhaustiveness-checking
function assertUnreachable(x) {
    throw new Error("Unexpected object: " + x);
}
exports.assertUnreachable = assertUnreachable;
//# sourceMappingURL=tsHelper.js.map