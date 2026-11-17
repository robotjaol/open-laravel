export interface AuthUser {
    id: number;
    name: string;
    email: string;
    status: string;
    email_verified_at: string | null;
}

export interface Paginated<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export interface TableQuery {
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
    filters: Record<string, string>;
}

export interface SharedProps {
    name: string;
    auth: { user: AuthUser | null; permissions: string[]; roles: string[] };
    flash: { success: string | null; error: string | null };
    notifications: { unread: number };
    features: { registration: boolean };
    [key: string]: unknown;
}

export interface Option {
    value: string;
    label: string;
}
