'use client';

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "../../_components/modal";

interface GroupChatModalProps {
    users: ExtendedUser[];
    isOpen?: boolean;
    onClose: () => void;
}

export const GroupChatModal = ({ users, isOpen, onClose }: GroupChatModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FieldValues>({
        defaultValues: {
            name: "",
            members: [],
        },
    });

    const { handleSubmit, control } = form;

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            ...data,
            isGroup: true,
        }).then(() => {
            router.refresh();
            onClose();
        }).catch(() => toast.error('Failed to create group chat.'))
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12 ">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Create a group chat
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Create a group chat with your friends.
                            </p>
                            <div className="mt-10 flex flex-col gap-y-8">
                                <FormField
                                    control={control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Classmates'
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="members"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Members</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Select
                                                        disabled={isLoading}
                                                        onValueChange={(value) => {
                                                            const currentValue = field.value || [];
                                                            const newValue = currentValue.includes(value)
                                                                ? currentValue.filter((item: string) => item !== value)
                                                                : [...currentValue, value];
                                                            field.onChange(newValue);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select members">
                                                                {field.value?.length
                                                                    ? field.value.map((id: string) =>
                                                                        users.find((user) => user.id === id)?.name
                                                                    ).join(", ")
                                                                    : "Select members"}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {users
                                                                .filter((user) => user.id)
                                                                .map((user) => (
                                                                    <SelectItem key={user.id} value={user.id!}>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={field.value?.includes(user.id)}
                                                                                readOnly
                                                                            />
                                                                            {user.name}
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};