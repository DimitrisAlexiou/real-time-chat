"use client";

import { Modal } from "@/app/(protected)/_components/modal";
import Image from "next/image";

interface ImageModalProps {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

export const ImageModal = ({ src, isOpen, onClose }: ImageModalProps) => {
    if (!src) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-80 h-80">
                <Image
                    src={src}
                    alt="Image"
                    fill
                    className="object-cover"
                />
            </div>
        </Modal>
    );
}