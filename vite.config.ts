import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        cssCodeSplit: false,
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.tsx'),
                '3d': resolve(__dirname, 'src/3d.ts'),
            },
            fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
            cssFileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
            output: [
                {
                    format: 'es',
                    chunkFileNames: 'chunks/[name]-[hash].js',
                    globals: { react: 'React' },
                },
                {
                    format: 'cjs',
                    chunkFileNames: 'chunks/[name]-[hash].cjs',
                    globals: { react: 'React' },
                },
            ],
        },
    },
});
