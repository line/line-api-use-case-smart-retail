// See https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-exhaustiveness-checking
export function assertUnreachable(x) {
    throw new Error(`Unexpected object: ${x}`);
}
//# sourceMappingURL=tsHelper.js.map