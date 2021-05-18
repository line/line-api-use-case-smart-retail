/**
 * A 2-Dimensional rectangle given by its relative position and size,
 * representing the area where barcode operations are performed.
 */
export interface SearchArea {
    /**
     * The x-coordinate position of the top-left corner of the rectangle, given as width percentage (0.0 - 1.0).
     */
    readonly x: number;
    /**
     * The y-coordinate position of the top-left corner of the rectangle, given as height percentage (0.0 - 1.0).
     */
    readonly y: number;
    /**
     * The width of the rectangle, given as width percentage (0.0 - 1.0).
     */
    readonly width: number;
    /**
     * The height of the rectangle, given as height percentage (0.0 - 1.0).
     */
    readonly height: number;
}
