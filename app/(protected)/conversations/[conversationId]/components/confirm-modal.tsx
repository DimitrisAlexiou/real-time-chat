"use client";

import axios from "axios";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";
import { DialogTitle } from "@headlessui/react";
import { Modal } from "@/app/(protected)/_components/modal";
import { Button } from "@/components/ui/button";
import useConversation from "@/hooks/use-conversation";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

export const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);
        axios.delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose();
                router.push('/conversations');
                router.refresh();
            })
            .catch(() => toast.error('Something went wrong. Please try again.'))
            .finally(() => setIsLoading(false));
    }, [conversationId, onClose, router]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center
                    rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                    <FiAlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Delete Conversation
                    </DialogTitle>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this conversation? This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button disabled={isLoading} onClick={onDelete} variant={"destructive"}>
                    Delete
                </Button>
                <Button disabled={isLoading} onClick={onClose} variant={"secondary"} className="mr-3">
                    Cancel
                </Button>
            </div>
        </Modal>
    )
}