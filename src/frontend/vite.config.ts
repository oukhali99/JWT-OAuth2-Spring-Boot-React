import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            modules: path.resolve(__dirname, "src/modules"),
            hooks: path.resolve(__dirname, "src/hooks"),
        },
    },
    server: {
        port: 3000, // or any port you prefer
    },
});
