import { describe, it, expect } from 'vitest';
import request from 'supertest';
const BASE_URL = 'http://localhost:5000';

describe('Voice Control API Health (Supertest)', () => {
    it('SHOULD return the API Gateway status required for Voice Assistant sync', async () => {
        const res = await request(BASE_URL).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status');
    });
});
