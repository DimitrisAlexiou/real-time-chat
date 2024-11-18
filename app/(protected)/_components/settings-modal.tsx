"use client";

import * as z from 'zod';
import Image from "next/image";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";
import { useSession } from 'next-auth/react';
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Modal } from "./modal";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoImageOutline } from 'react-icons/io5';
import { settings } from '@/actions/settings';

interface SettingsModalProps {
    user?: ExtendedUser;
    isOpen?: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ user, isOpen, onClose }: SettingsModalProps) => {
    const router = useRouter();
    const { update } = useSession();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            image: user?.image || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        },
    })

    const image = form.watch('image');

    const handleUpload = (result: any) => {
        form.setValue('image', result?.info?.secure_url, {
            shouldValidate: true,
        });
    }

    const onSubmit: SubmitHandler<z.infer<typeof SettingsSchema>> =
        async (data: z.infer<typeof SettingsSchema>) => {
            startTransition(() => {
                settings(data)
                    .then((response) => {
                        if (response.status !== 200) {
                            setError(response.error);
                            return;
                        }
                        router.refresh();
                        update();
                        onClose();
                    })
                    .catch(() => toast.error('Something went wrong! Please try again.'));
            });
        }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Profile
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Update your profile information.
                    </p>
                    <div className="mt-10 flex flex-col gap-y-8">
                        <Card className="w-[450px]">
                            <CardContent className="mt-5">
                                <Form {...form}>
                                    <form
                                        className='space-y-6'
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <div className='space-y-4'>
                                            <FormField
                                                control={form.control}
                                                name='name'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder='John Doe'
                                                                disabled={isPending}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='mt-2 flex items-center gap-x-3'>
                                                <Image
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                    src={image || user?.image || '/images/user_profile_placeholder.jpeg'}
                                                    alt="Avatar"
                                                />
                                                <CldUploadButton
                                                    options={{ maxFiles: 1 }}
                                                    onSuccess={handleUpload}
                                                    uploadPreset="owje1nfw"
                                                >
                                                    <IoImageOutline size={30} className="text-gray-800" />
                                                </CldUploadButton>
                                            </div>
                                            {!user?.isOAuth && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name='email'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder='JohnDoe@email.com'
                                                                        disabled={isPending}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name='password'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Password</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type='password'
                                                                        placeholder='******'
                                                                        disabled={isPending}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name='newPassword'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>New Password</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type='password'
                                                                        placeholder='******'
                                                                        disabled={isPending}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name='isTwoFactorEnabled'
                                                        render={({ field }) => (
                                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                                                <div className='space-y-0.5'>
                                                                    <FormLabel>Two Factor Authentication</FormLabel>
                                                                    <FormDescription>
                                                                        Enable two factor authentication for your account
                                                                    </FormDescription>
                                                                </div>
                                                                <FormControl>
                                                                    <Switch
                                                                        disabled={isPending}
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <FormError message={error} />
                                        <FormSuccess message={success} />
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <Button
                                                type='submit'
                                                disabled={isPending}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                className="mr-3"
                                                type='button'
                                                onClick={onClose}
                                                disabled={isPending}
                                                variant={"secondary"}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Modal>
    );
}