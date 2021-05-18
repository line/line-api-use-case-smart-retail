/**
 * @hidden
 */
export class CustomError extends Error {
    // istanbul ignore next
    constructor({ name = "", message = "", } = {}) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.name = name;
    }
}
//# sourceMappingURL=customError.js.map