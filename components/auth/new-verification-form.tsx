'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PuffLoader } from 'react-spinners'
import { newVerification } from '@/actions/new-verification';
import { CardWrapper } from "./card-wrapper";
import { FormSuccess } from '../form-success';
import { FormError } from '../form-error';

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError('Missing token!');
            return;
        }

        newVerification(token)
            .then((response) => {
                setSuccess(response.success);
                setError(response.error);
            })
            .catch(() => {
                setError('Something went wrong!');
            });
    }, [error, success, token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <PuffLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}