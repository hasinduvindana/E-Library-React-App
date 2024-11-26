import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Correct React plugin for Vite
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// Define the base folder for HTTPS certificate storage
const baseFolder =
    env.APPDATA && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

// Ensure the directory exists for storing certificates
if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

const certificateName = 'elibrary.client';
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Check and generate certificates if they do not exist
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    console.log('Certificates not found. Generating certificates...');
    const result = child_process.spawnSync(
        'dotnet',
        [
            'dev-certs',
            'https',
            '--export-path',
            certFilePath,
            '--format',
            'Pem',
            '--no-password',
        ],
        { stdio: 'inherit' }
    );

    if (result.status !== 0) {
        throw new Error(
            "Could not create certificate. Ensure 'dotnet dev-certs' works on your system."
        );
    }
}

// Configure the backend target URL
const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7183';

// Export the Vite configuration
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx'], // Add TypeScript support
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false,
            },
        },
        port: 5173,
        https: fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)
            ? {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
            : false, // Fallback to HTTP if certificates are missing
    },
});
