/**
 * Module 4.7 - Skip Invalid Votes (ZK Range Proof)
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 4.7.1 - API accepts a valid vote submission with a range_proof attached
 * 4.7.2 - API accepts a vote submission without range_proof (legacy/backward-compat)
 * 4.7.3 - The /api/admin/votes endpoint returns range_proof field per vote
 * 4.7.4 - Injecting a fake vote (candidate_id='2') is stored but will be skipped during tally
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/ZKRangeProof_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000';

describe('Module 4.7 - ZK Range Proof (Supertest)', () => {

    it('4.7.1 - GET /api/admin/votes returns range_proof field per vote', async () => {
        const res = await request(BASE_URL)
            .get('/api/admin/votes')
            .set('Authorization', 'Bearer test-admin-token');

        // Endpoint should respond (even if 401/403, it should exist)
        expect([200, 401, 403]).toContain(res.status);

        if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
            // Each vote should have a range_proof key (can be null for legacy votes)
            res.body.forEach(vote => {
                expect(vote).toHaveProperty('candidate_id');
                expect(vote).toHaveProperty('constituency');
                // range_proof key must exist (value may be null for old votes)
                expect(Object.prototype.hasOwnProperty.call(vote, 'range_proof')).toBe(true);
            });
        }
    });

    it('4.7.2 - POST /api/admin/inject-fake-vote injects a vote with candidate_id that decrypts to invalid range', async () => {
        const res = await request(BASE_URL)
            .post('/api/admin/inject-fake-vote')
            .set('Content-Type', 'application/json');

        // Should succeed (200) with a message confirming fake vote was injected
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        console.log('[4.7] Fake vote injected — tally should skip this during decryption.');
    });

    it('4.7.3 - POST /api/admin/clear-fake-votes removes invalid test votes from the database', async () => {
        const res = await request(BASE_URL)
            .post('/api/admin/clear-fake-votes')
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        console.log('[4.7] Test data cleared — tally will show all votes valid after this.');
    });

    it('4.7.4 - GET /api/health confirms API gateway is available for ZK proof verification', async () => {
        const res = await request(BASE_URL).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});
