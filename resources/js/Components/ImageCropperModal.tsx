import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
    X,
    Check,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Crop,
    Sliders,
} from "lucide-react";
import getCroppedImg from "@/Utils/cropImage";

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropperModal({
    isOpen,
    imageSrc,
    onClose,
    onCropComplete,
}: ImageCropperModalProps) {
    if (!isOpen || !imageSrc) return null;

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
        undefined,
    );
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Preset Ukuran Tampilan Maksimum Gambar di dalam Naskah
    const [targetDimension, setTargetDimension] = useState<
        "sm" | "md" | "lg" | "full"
    >("md");

    const onCropChange = (newCrop: { x: number; y: number }) => {
        setCrop(newCrop);
    };

    const onCropAreaComplete = useCallback(
        (_croppedArea: any, croppedPixels: any) => {
            setCroppedAreaPixels(croppedPixels);
        },
        [],
    );

    const handleApply = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                // Tentukan batas lebar maksimum berdasarkan preset pilihan pengguna
                let maxOutputWidth = 600;
                if (targetDimension === "sm")
                    maxOutputWidth = 240; // Ikon / Logo Kecil
                else if (targetDimension === "md")
                    maxOutputWidth = 480; // Sedang (Rekomendasi)
                else if (targetDimension === "lg")
                    maxOutputWidth = 720; // Foto Artikel Standar
                else if (targetDimension === "full") maxOutputWidth = 1000; // Penuh

                const croppedFile = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels,
                    rotation,
                    maxOutputWidth,
                );
                if (croppedFile) {
                    onCropComplete(croppedFile);
                }
            }
        } catch (e) {
            console.error("Gagal memotong gambar:", e);
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-4 sm:p-6 shadow-2xl space-y-4">
                {/* 1. Header Modal */}
                <div className="flex items-center justify-between border-b border-[#E8CEBC] pb-3">
                    <div className="flex items-center gap-2">
                        <Crop size={18} className="text-[#1D4533]" />
                        <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                            Sesuaikan Ukuran & Potong Foto
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 text-[#5E3122]/60 hover:bg-[#E8CEBC]/50 hover:text-black cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* 2. Pengaturan Rasio & Ukuran Tampilan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 border border-[#E8CEBC] p-2.5 rounded-2xl">
                    {/* Rasio Crop */}
                    <div>
                        <span className="block text-[10.5px] font-bold text-[#5E3122]/80 mb-1">
                            Bentuk Rasio:
                        </span>
                        <div className="flex rounded-lg border border-[#E8CEBC] bg-white p-0.5 text-[11px] font-bold">
                            <button
                                type="button"
                                onClick={() => setAspectRatio(undefined)}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    aspectRatio === undefined
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                            >
                                Bebas
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspectRatio(16 / 9)}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    aspectRatio === 16 / 9
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                            >
                                16:9
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspectRatio(4 / 3)}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    aspectRatio === 4 / 3
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                            >
                                4:3
                            </button>
                            <button
                                type="button"
                                onClick={() => setAspectRatio(1)}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    aspectRatio === 1
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                            >
                                1:1
                            </button>
                        </div>
                    </div>

                    {/* Ukuran Tampilan Naskah (Mencegah Gambar Raksasa) */}
                    <div>
                        <span className="block text-[10.5px] font-bold text-[#5E3122]/80 mb-1 flex items-center gap-1">
                            <Sliders size={12} className="text-[#1D4533]" />{" "}
                            Ukuran Tampilan:
                        </span>
                        <div className="flex rounded-lg border border-[#E8CEBC] bg-white p-0.5 text-[11px] font-bold">
                            <button
                                type="button"
                                onClick={() => setTargetDimension("sm")}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    targetDimension === "sm"
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                                title="Kecil (Cocok untuk logo & ikon)"
                            >
                                Kecil
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetDimension("md")}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    targetDimension === "md"
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                                title="Sedang (Pas untuk foto kajian)"
                            >
                                Sedang
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetDimension("lg")}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    targetDimension === "lg"
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                                title="Besar"
                            >
                                Besar
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetDimension("full")}
                                className={`flex-1 py-1 rounded-md transition cursor-pointer ${
                                    targetDimension === "full"
                                        ? "bg-[#1D4533] text-[#F7EAE0]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                                }`}
                                title="Lebar Penuh"
                            >
                                Penuh
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Area Kanvas Crop */}
                <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden rounded-2xl bg-black/95 shadow-inner">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        minZoom={0.3}
                        maxZoom={3.5}
                        restrictPosition={false}
                        onCropChange={onCropChange}
                        onCropComplete={onCropAreaComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                {/* 4. Kontrol Zoom & Rotasi */}
                <div className="flex items-center justify-between gap-4 border-t border-[#E8CEBC] pt-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setZoom((z) => Math.max(0.3, z - 0.1))
                            }
                            className="text-[#8C5E43] hover:text-[#1D4533] cursor-pointer"
                            title="Perkecil"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <input
                            type="range"
                            min={0.3}
                            max={3.5}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="h-1.5 w-24 sm:w-36 bg-[#E8CEBC] rounded-lg accent-[#1D4533] cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setZoom((z) => Math.min(3.5, z + 0.1))
                            }
                            className="text-[#8C5E43] hover:text-[#1D4533] cursor-pointer"
                            title="Perbesar"
                        >
                            <ZoomIn size={16} />
                        </button>
                        <span className="text-[10.5px] font-mono text-[#8C5E43] min-w-9">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-[#1D4533] bg-[#FAF3EB] border border-[#E8CEBC] px-3 py-1.5 rounded-xl hover:bg-[#E8CEBC]/50 cursor-pointer transition shadow-2xs"
                    >
                        <RotateCw size={13} />
                        <span>Putar 90°</span>
                    </button>
                </div>

                {/* 5. Tombol Aksi */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-[#E8CEBC] bg-white px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#FAF3EB] cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] shadow-xs cursor-pointer active:scale-95"
                    >
                        <Check size={15} /> Terapkan & Masukkan
                    </button>
                </div>
            </div>
        </div>
    );
}
