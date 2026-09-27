import {
    isRouteErrorResponse,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigation,
} from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import type { Route } from "./+types/root";
import { FileLoaderProvider } from "./components/FileLoader";
import { Header } from "./components/Header";
import { pageMeta, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./lib/site";
import "./app.css";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export function meta() {
    return pageMeta(SITE_TITLE, SITE_DESCRIPTION, `${SITE_URL}/assets/og-image.png`);
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <script
                    defer
                    data-website-id="096aad0c-a094-43d5-8fcb-16bdde0402a1"
                    src="https://analytics.ekga.me/script.js"
                />
            </head>
            <body>
                {children}
                <Toaster theme="dark" position="bottom-center" richColors toastOptions={{ style: { borderRadius: 2 } }} />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

function NavigationProgress() {
    const navigation = useNavigation();
    if (navigation.state === 'idle') {
        return null;
    }
    return (
        <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden" role="progressbar" aria-label="Loading">
            <div className="bg-accent animate-indeterminate h-full w-2/5" />
        </div>
    );
}

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col">
            <NavigationProgress />
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}

export default function App() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <FileLoaderProvider>
                <Page>
                    <Outlet />
                </Page>
            </FileLoaderProvider>
        </QueryClientProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let title = 'Something went wrong';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        title = error.status === 404 ? 'Not found' : 'Something went wrong';
        details = typeof error.data === 'string' && error.data.length > 0
            ? error.data
            : error.status === 404
                ? 'The requested page could not be found.'
                : details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <Page>
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-ink-300">{details}</p>
                <Link to="/" className="btn btn-primary">Load another beatmap</Link>
                {stack && (
                    <pre className="w-full overflow-x-auto rounded-xs border border-ink-700 bg-ink-900 p-4 text-left text-xs">
                        <code>{stack}</code>
                    </pre>
                )}
            </div>
        </Page>
    );
}
