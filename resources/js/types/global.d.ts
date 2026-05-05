import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

declare global {
    function route(
        name: string,
        params?: Record<string, unknown> | string | number | undefined,
        absolute?: boolean
    ): string;
}

export {};