import { Point } from "./point";
/**
 * A 2-dimensional quadrilateral shape given by its 4 corners, representing a barcode location.
 * The polygon has an orientation given by the specific corner types.
 */
export interface Quadrilateral {
    /**
     * The top-left corner.
     */
    readonly topLeft: Point;
    /**
     * The top-right corner.
     */
    readonly topRight: Point;
    /**
     * The bottom-right corner.
     */
    readonly bottomRight: Point;
    /**
     * The bottom-left corner.
     */
    readonly bottomLeft: Point;
}
