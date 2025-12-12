// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom', // Use happy-dom for DOM testing
    globals: true, // Optional: allows using describe/it/expect without importing
    include: ['tests/**/*.{test,spec}.{js,ts}'], // Where your tests are
  },
})