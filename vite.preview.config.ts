import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Builds the static, backend-free preview into docs/preview. Run: npm run build:preview */
export default defineConfig({
    base: './',
    publicDir: false,
    plugins: [inertia(), react(), tailwindcss()],
    resolve: { alias: { '@': '/resources/js' } },
    build: {
        outDir: 'docs/preview',
        emptyOutDir: true,
        rollupOptions: { input: 'preview.html' },
    },
});
