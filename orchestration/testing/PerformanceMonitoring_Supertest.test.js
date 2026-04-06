/**
 * Module 5.3 - System Performance Monitoring
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 5.3.1 - GET /api/metrics returns election and performance metrics
 * 5.3.2 - GET /api/metrics/health returns service health status
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/PerformanceMonitoring_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000';

describe('Module 5.3 - System Performance Monitoring (Supertest)', () => {

    it('5.3.1 - GET /api/metrics returns system performance data', async () => {
        const res = await request(BASE_URL).get('/api/metrics');
        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty('election');
        expect(res.body).toHaveProperty('performance');
        expect(res.body).toHaveProperty('system');
        expect(res.body).toHaveProperty('timeSeries');

        expect(res.body.performance).toHaveProperty('activeConnections');
        expect(res.body.performance).toHaveProperty('votesPerSec');
        expect(res.body.performance).toHaveProperty('errorsPerMin');

        console.log('[5.3.1] Metrics endpoint returned correct structure.');
    });

    it('5.3.2 - GET /api/metrics/health returns component status', async () => {
        const res = await request(BASE_URL).get('/api/metrics/health');
        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty('overall');
        expect(res.body).toHaveProperty('services');

        expect(res.body.services).toHaveProperty('database');
        expect(res.body.services).toHaveProperty('api');
        expect(res.body.services).toHaveProperty('blockchain');

        console.log(`[5.3.2] Health endpoint overall status: ${res.body.overall}`);
    });

});
