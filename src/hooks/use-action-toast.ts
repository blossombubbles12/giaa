import { toast } from 'sonner';

interface ActionToastOptions {
    loading?: string;
    success?: string | ((data: any) => string);
    error?: string | ((error: any) => string);
}

export function useActionToast() {
    const execute = async <T,>(
        promise: Promise<T>,
        options: ActionToastOptions = {}
    ) => {
        const {
            loading = 'Processing...',
            success = 'Action completed successfully',
            error = 'Something went wrong. Please try again.',
        } = options;

        const toastId = toast.loading(loading);

        try {
            const data = await promise;

            const successMessage = typeof success === 'function' ? success(data) : success;
            toast.success(successMessage, { id: toastId });

            return { data, error: null };
        } catch (err: any) {
            console.error('Action error:', err);

            const errorMessage = typeof error === 'function' ? error(err) : (err.message || error);
            toast.error(errorMessage, { id: toastId });

            return { data: null, error: err };
        }
    };

    return { execute };
}
