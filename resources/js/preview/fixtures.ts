/**
 * Sample data for the static preview build. Nothing here ships in the production bundle:
 * this folder is only imported by resources/js/preview.tsx.
 */
import { routes } from '@/lib/routes';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const shared = {
    name: 'Open Laravel',
    auth: {
        user: {
            id: 1,
            name: 'Alex Morgan',
            email: 'alex@example.com',
            status: 'active',
            email_verified_at: ago(100000),
        },
        permissions: ['*'],
        roles: ['Super Admin'],
    },
    flash: { success: null, error: null },
    notifications: { unread: 2 },
    features: { registration: true },
};

const guest = { ...shared, auth: { user: null, permissions: [], roles: [] } };

const meta = (total: number, per = 10) => ({
    current_page: 1,
    last_page: Math.max(1, Math.ceil(total / per)),
    per_page: per,
    total,
    from: 1,
    to: Math.min(total, per),
});
const query = { search: '', sort: 'name', direction: 'asc' as const, per_page: 10, filters: {} };

const roleNames = ['Super Admin', 'Admin', 'Manager', 'Viewer'];
const people = [
    ['Alex Morgan', 'alex@example.com', 'active', ['Super Admin']],
    ['Priya Nair', 'priya@example.com', 'active', ['Admin']],
    ['Daniel Okafor', 'daniel@example.com', 'active', ['Manager']],
    ['Mei Tanaka', 'mei@example.com', 'active', ['Manager']],
    ['Lucas Meyer', 'lucas@example.com', 'inactive', ['Viewer']],
    ['Sofia Rossi', 'sofia@example.com', 'active', ['Viewer']],
    ['Omar Haddad', 'omar@example.com', 'suspended', []],
    ['Hannah Berg', 'hannah@example.com', 'active', ['Viewer']],
] as const;

const users = people.map(([name, email, status, roles], i) => ({
    id: i + 1,
    name,
    email,
    status,
    roles: [...roles],
    last_login_at: status === 'active' ? ago(30 + i * 240) : null,
    created_at: ago(40000 + i * 3000),
    can: { update: i !== 0, delete: i > 1 },
}));

const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
];
const roleOptions = roleNames.map((r) => ({ value: r, label: r }));

const groups = [
    {
        key: 'users',
        label: 'Users',
        permissions: [
            ['users.view', 'View users'],
            ['users.create', 'Create users'],
            ['users.update', 'Edit users'],
            ['users.delete', 'Delete users'],
        ],
    },
    {
        key: 'roles',
        label: 'Roles and permissions',
        permissions: [
            ['roles.view', 'View roles'],
            ['roles.create', 'Create roles'],
            ['roles.update', 'Edit roles'],
            ['roles.delete', 'Delete roles'],
            ['permissions.view', 'View permission matrix'],
            ['permissions.manage', 'Change role permissions'],
        ],
    },
    {
        key: 'projects',
        label: 'Projects',
        permissions: [
            ['projects.view', 'View projects'],
            ['projects.create', 'Create projects'],
            ['projects.update', 'Edit projects'],
            ['projects.delete', 'Delete projects'],
        ],
    },
    {
        key: 'system',
        label: 'System',
        permissions: [
            ['audit.view', 'View activity log'],
            ['settings.view', 'View settings'],
            ['settings.update', 'Change settings'],
            ['api.view', 'View API overview'],
        ],
    },
].map((g) => ({ ...g, permissions: g.permissions.map(([name, label]) => ({ name, label })) }));

const allPerms = groups.flatMap((g) => g.permissions.map((p) => p.name));
const rolePerms: Record<string, string[]> = {
    'Super Admin': allPerms,
    Admin: allPerms,
    Manager: ['users.view', ...allPerms.filter((p) => p.startsWith('projects.'))],
    Viewer: ['projects.view'],
};

const projectNames = [
    'Customer portal redesign',
    'Warehouse analytics',
    'Billing migration',
    'Mobile app v2',
    'Data retention review',
    'Partner API',
    'Onboarding revamp',
    'Security hardening',
    'Support tooling',
    'Q4 reporting',
];
const projectStatuses = [
    'active',
    'planned',
    'active',
    'on_hold',
    'completed',
    'active',
    'planned',
    'active',
    'completed',
    'on_hold',
];
const projects = projectNames.map((name, i) => ({
    id: i + 1,
    code: `PRJ-${String(1001 + i)}`,
    name,
    status: projectStatuses[i],
    owner: { id: 3, name: 'Daniel Okafor' },
    starts_on: '2026-09-01',
    due_on: `2026-${String(11 + (i % 2)).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
    updated_at: ago(60 + i * 500),
    can: { update: true, delete: true },
}));
const projectStatusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On hold' },
    { value: 'completed', label: 'Completed' },
];

const events = [
    'auth.login',
    'users.created',
    'users.roles_changed',
    'roles.updated',
    'settings.updated',
    'permissions.toggled',
    'created',
    'updated',
];
const logDescriptions: [string, string, string | null][] = [
    ['auth.login', 'Signed in', 'Alex Morgan'],
    ['users.roles_changed', 'Roles changed for sofia@example.com', 'Priya Nair'],
    ['permissions.toggled', 'Granted audit.view for Manager', 'Alex Morgan'],
    ['settings.updated', 'Application settings updated', 'Alex Morgan'],
    ['created', 'Project PRJ-1010 created', 'Daniel Okafor'],
    ['users.created', 'User hannah@example.com created', 'Priya Nair'],
    ['roles.updated', 'Role Manager updated', 'Alex Morgan'],
    ['auth.login', 'Signed in', 'Mei Tanaka'],
];
const logs = logDescriptions.map(([event, description, user], i) => ({
    id: 200 - i,
    event,
    description,
    user: user ? { id: i + 1, name: user } : null,
    subject: event === 'created' ? 'Project#10' : null,
    ip_address: `203.0.113.${10 + i}`,
    created_at: ago(15 + i * 95),
    properties: event === 'users.roles_changed' ? { from: ['Viewer'], to: ['Manager'] } : null,
}));

const notifications = [
    ['Welcome to Open Laravel', 'Your workspace is ready. Start by inviting your team.', null, 20],
    ['Project due soon', 'PRJ-1001 Customer portal redesign is due in 3 days.', null, 300],
    ['Role updated', 'The Manager role gained the audit.view permission.', ago(100), 2000],
].map(([title, body, read, mins], i) => ({
    id: `n${i}`,
    title,
    body,
    read_at: read,
    created_at: ago(mins as number),
}));

const endpoints = [
    ['POST', '/api/v1/auth/token', false],
    ['DELETE', '/api/v1/auth/token', true],
    ['GET', '/api/v1/me', true],
    ['GET', '/api/v1/projects', true],
    ['POST', '/api/v1/projects', true],
    ['GET', '/api/v1/projects/{project}', true],
    ['PUT', '/api/v1/projects/{project}', true],
    ['DELETE', '/api/v1/projects/{project}', true],
].map(([method, uri, auth]) => ({
    method,
    uri,
    auth,
    middleware: auth ? ['api', 'auth:sanctum', 'active'] : ['api', 'throttle:api-login'],
}));

export interface Fixture {
    component: string;
    props: Record<string, unknown>;
    guest?: boolean;
}

const timezones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Jakarta', 'Asia/Tokyo'].map(
    (z) => ({ value: z, label: z }),
);

export function resolveFixture(path: string): Fixture {
    const p = path.split('?')[0].replace(/\/+$/, '') || '/';
    const editUser = p.match(/^\/users\/(\d+)\/edit$/);
    const editRole = p.match(/^\/roles\/(\d+)\/edit$/);
    const editProject = p.match(/^\/projects\/(\d+)\/edit$/);

    if (editUser) {
        const u = users[Number(editUser[1]) - 1] ?? users[1];
        return {
            component: 'users/edit',
            props: {
                user: { id: u.id, name: u.name, email: u.email, status: u.status, roles: u.roles },
                roles: roleOptions,
                statuses,
            },
        };
    }
    if (editRole) {
        const name = roleNames[Number(editRole[1]) - 1] ?? 'Manager';
        return {
            component: 'roles/edit',
            props: {
                role: {
                    id: Number(editRole[1]),
                    name,
                    permissions: rolePerms[name],
                    is_locked: name === 'Super Admin',
                },
                groups,
            },
        };
    }
    if (editProject) {
        const pr = projects[Number(editProject[1]) - 1] ?? projects[0];
        return {
            component: 'projects/edit',
            props: {
                project: {
                    id: pr.id,
                    code: pr.code,
                    name: pr.name,
                    description: 'Sample description.',
                    status: pr.status,
                    owner_id: 3,
                    starts_on: pr.starts_on,
                    due_on: pr.due_on,
                },
                statuses: projectStatusOptions,
                owners: users.map((u) => ({ value: String(u.id), label: u.name })),
            },
        };
    }

    switch (p) {
        case routes.login:
        case '/':
            return { component: 'auth/login', props: { canRegister: true }, guest: true };
        case routes.register:
            return { component: 'auth/register', props: {}, guest: true };
        case routes.forgotPassword:
            return { component: 'auth/forgot-password', props: {}, guest: true };
        case '/reset-password/preview-token':
            return {
                component: 'auth/reset-password',
                props: { token: 'preview-token', email: 'alex@example.com' },
                guest: true,
            };
        case routes.verifyNotice:
            return { component: 'auth/verify-email', props: {} };
        case routes.dashboard:
            return {
                component: 'dashboard',
                props: {
                    kpis: {
                        users_total: 128,
                        users_active: 114,
                        roles_total: 4,
                        logins_24h: 86,
                        failed_logins_24h: 3,
                    },
                    logins_chart: [
                        ['Fri', 61],
                        ['Sat', 24],
                        ['Sun', 19],
                        ['Mon', 92],
                        ['Tue', 105],
                        ['Wed', 98],
                        ['Thu', 86],
                    ].map(([label, value]) => ({ label, value })),
                    recent_activity: logs.slice(0, 6).map((l) => ({
                        id: l.id,
                        description: l.description,
                        user: l.user?.name ?? null,
                        created_at: l.created_at,
                    })),
                },
            };
        case routes.users.index:
            return {
                component: 'users/index',
                props: {
                    users: { data: users, meta: meta(128) },
                    query,
                    filters: { roles: roleOptions, statuses },
                },
            };
        case routes.users.create:
            return { component: 'users/create', props: { roles: roleOptions, statuses } };
        case routes.roles.index:
            return {
                component: 'roles/index',
                props: {
                    roles: {
                        data: roleNames.map((n, i) => ({
                            id: i + 1,
                            name: n,
                            users_count: [1, 3, 24, 100][i],
                            permissions_count: rolePerms[n].length,
                            is_locked: n === 'Super Admin',
                            can: { update: n !== 'Super Admin', delete: n !== 'Super Admin' },
                        })),
                        meta: meta(4),
                    },
                    query,
                },
            };
        case routes.roles.create:
            return { component: 'roles/create', props: { groups } };
        case routes.permissions.index:
            return {
                component: 'permissions/index',
                props: {
                    groups,
                    roles: roleNames.map((n, i) => ({
                        id: i + 1,
                        name: n,
                        permissions: rolePerms[n],
                        is_locked: n === 'Super Admin',
                    })),
                    canManage: true,
                },
            };
        case routes.projects.index:
            return {
                component: 'projects/index',
                props: {
                    projects: { data: projects, meta: meta(42) },
                    query: { ...query, sort: 'updated_at', direction: 'desc' },
                    filters: { statuses: projectStatusOptions },
                },
            };
        case routes.projects.create:
            return {
                component: 'projects/create',
                props: {
                    statuses: projectStatusOptions,
                    owners: users.map((u) => ({ value: String(u.id), label: u.name })),
                },
            };
        case routes.activity:
            return {
                component: 'activity/index',
                props: {
                    logs: { data: logs, meta: meta(240) },
                    query: { ...query, sort: 'created_at', direction: 'desc' },
                    filters: { events: events.map((e) => ({ value: e, label: e })) },
                },
            };
        case routes.notifications.index:
            return {
                component: 'notifications/index',
                props: { notifications: { data: notifications, meta: meta(3, 15) }, unread: 2 },
            };
        case routes.settings.profile:
            return {
                component: 'settings/profile',
                props: {
                    profile: {
                        name: 'Alex Morgan',
                        email: 'alex@example.com',
                        email_verified_at: ago(100000),
                    },
                    mustVerifyEmail: false,
                    loginHistory: [0, 1, 2, 3].map((i) => ({
                        id: i + 1,
                        event: i === 2 ? 'failed' : 'login',
                        ip_address: '203.0.113.7',
                        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130',
                        created_at: ago(40 + i * 700),
                    })),
                },
            };
        case routes.settings.password:
            return { component: 'settings/password', props: {} };
        case routes.settings.sessions:
            return {
                component: 'settings/sessions',
                props: {
                    supported: true,
                    sessions: [
                        {
                            id: 'a1b2c3d4e5f6',
                            ip_address: '203.0.113.7',
                            user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130',
                            last_active: ago(1),
                            current: true,
                        },
                        {
                            id: '9f8e7d6c5b4a',
                            ip_address: '198.51.100.22',
                            user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18) Safari/605',
                            last_active: ago(600),
                            current: false,
                        },
                    ],
                },
            };
        case routes.settings.application:
            return {
                component: 'settings/application',
                props: {
                    settings: {
                        app_name: 'Open Laravel',
                        timezone: 'UTC',
                        locale: 'en',
                        registration_enabled: true,
                        audit_retention_days: 365,
                    },
                    timezones,
                    locales: [
                        { value: 'en', label: 'English' },
                        { value: 'id', label: 'Bahasa Indonesia' },
                    ],
                    canUpdate: true,
                },
            };
        case routes.api:
            return {
                component: 'api/overview',
                props: { baseUrl: 'https://app.example.com/api/v1', version: 'v1', endpoints },
            };
        case '/errors/403':
            return { component: 'errors/error', props: { status: 403 } };
        case '/errors/500':
            return { component: 'errors/error', props: { status: 500 } };
        default:
            return { component: 'errors/error', props: { status: 404 } };
    }
}

export function pageFor(path: string, flash?: string) {
    const f = resolveFixture(path);
    const base = f.guest ? guest : shared;
    return {
        component: f.component,
        props: { ...base, flash: { success: flash ?? null, error: null }, ...f.props, errors: {} },
    };
}
