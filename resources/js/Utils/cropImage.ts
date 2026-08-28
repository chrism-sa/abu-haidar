export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    maxOutputWidth = 800, // Batas maksimal resolusi agar gambar tidak raksasa
): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    // 1. Hitung Skala Pembatas Resolusi (Downscale jika gambar terlalu besar)
    const scale =
        pixelCrop.width > maxOutputWidth ? maxOutputWidth / pixelCrop.width : 1;
    const targetWidth = Math.round(pixelCrop.width * scale);
    const targetHeight = Math.round(pixelCrop.height * scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 2. Deteksi Format Asli (PNG atau JPEG)
    const isPng =
        imageSrc.startsWith("data:image/png") ||
        imageSrc.toLowerCase().endsWith(".png");
    const mimeType = isPng ? "image/png" : "image/jpeg";
    const fileName = isPng ? "cropped-image.png" : "cropped-image.jpg";

    // 3. Gambar ke Canvas dengan Skala Proporsional
    ctx.save();
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight,
    );
    ctx.restore();

    // 4. Return sebagai File Object yang Valid
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                const file = new File([blob], fileName, { type: mimeType });
                resolve(file);
            },
            mimeType,
            0.95,
        );
    });
}
