import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
const BASE_URL = 'http://localhost:5000';

describe('Fraud Detection (Supertest)', () => {
    let adminToken = '';
    beforeAll(async () => {
        const res = await request(BASE_URL).post('/api/auth/login').send({ username: 'sys_admin', password: 'admin_password123' });
        if (res.body.token) adminToken = res.body.token;
    });

    it('SHOULD trigger the Math Mismatch Fraud Watchdog (Breach Simulation)', async () => {
        const res = await request(BASE_URL).post('/api/admin/inject-fake-vote').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('Watchdog will catch this');
    });

    it('SHOULD clear the Fraud Test Data accurately', async () => {
        const res = await request(BASE_URL).post('/api/admin/clear-fake-votes').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
