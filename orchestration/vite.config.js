import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // In Vitest 3.2+, 'projects' replaces the old 'workspace' config
        projects: [
            'project-voter/vite.config.js',
            'backend-api/vitest.config.mjs'
        ],
        reporters: ['default', 'html'], // Combined reports for the whole election system
    }
})