'use client';

import { useRouter } from 'next/navigation';
import Heading from './heading';
import { Button } from './ui/button';

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState = ({
    title = '',
    subtitle = 'Select a chat or start a new conversation',
    showReset,
}: EmptyStateProps) => {
    const router = useRouter();

    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading center title={title} subtitle={subtitle} />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        variant={'outline'}
                        onClick={() => router.push('/')}
                    >
                        Back
                    </Button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;