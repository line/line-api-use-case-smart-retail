/**
 * A configuration object to define the properties of an image to be scanned.
 */
export interface ImageSettings {
    /**
     * The width of the image (columns of pixels).
     */
    readonly width: number;
    /**
     * The height of the image (rows of pixels).
     */
    readonly height: number;
    /**
     * The format of the pixel data, meaning the mapping of array bytes to image pixels.
     */
    readonly format: ImageSettings.Format;
}
export declare namespace ImageSettings {
    /**
     * Image bytes format/layout.
     */
    enum Format {
        /**
         * Single-channel 8-bit gray scale image.
         */
        GRAY_8U = 0,
        /**
         * RGB image with 8 bits per color channel.
         */
        RGB_8U = 1,
        /**
         * RGBA image with 8 bits per color channel.
         */
        RGBA_8U = 2
    }
}
