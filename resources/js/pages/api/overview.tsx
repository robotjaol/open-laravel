import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Endpoint {
    method: string;
    uri: string;
    auth: boolean;
    middleware: string[];
}

const methodVariant = (m: string) =>
    m === 'GET' ? 'success' : m === 'DELETE' ? 'danger' : 'primary';

export default function ApiOverview({
    baseUrl,
    version,
    endpoints,
}: {
    baseUrl: string;
    version: string;
    endpoints: Endpoint[];
}) {
    const curl = `curl -X POST ${baseUrl}/auth/token \\\n  -H "Accept: application/json" \\\n  -d "email=you@example.com" -d "password=..." -d "device_name=cli"`;
    const use = `curl ${baseUrl}/me \\\n  -H "Accept: application/json" \\\n  -H "Authorization: Bearer <token>"`;
    return (
        <>
            <Head title="API overview" />
            <PageHeader
                title="API overview"
                description={`Version ${version}. Endpoints below are read live from the route table.`}
                breadcrumbs={[{ label: 'System' }, { label: 'API overview' }]}
            />
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Get a token</CardTitle>
                        <CardDescription>
                            Tokens are Laravel Sanctum personal access tokens.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock label="Token request example">{curl}</CodeBlock>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>2. Call the API</CardTitle>
                        <CardDescription>Send the token as a bearer credential.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock label="Authenticated request example">{use}</CodeBlock>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6 rounded-card border bg-surface shadow-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Method</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Access</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {endpoints.map((e) => (
                            <TableRow key={`${e.method}-${e.uri}`}>
                                <TableCell>
                                    <Badge variant={methodVariant(e.method)}>{e.method}</Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">/{e.uri}</TableCell>
                                <TableCell>
                                    {e.auth ? (
                                        <Badge>Bearer token</Badge>
                                    ) : (
                                        <Badge variant="warning">Public</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
