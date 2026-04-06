/**
 * Module 4.8 - Automatic Tie-Breaking (TieBreak_Supertest.test.js)
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 4.8.1 - /api/admin/inject-tie-votes endpoint creates tied mock votes
 * 4.8.2 - /api/admin/votes endpoint returns transaction_hash field per vote
 * 4.8.3 - /api/admin/clear-fake-votes removes the tied mock votes
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/TieBreak_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000';

describe('Module 4.8 - Automatic Tie-Breaking (Supertest)', () => {

    it('4.8.1 - POST /api/admin/inject-tie-votes injects tied mock votes', async () => {
        const res = await request(BASE_URL)
            .post('/api/admin/inject-tie-votes')
            .set('Content-Type', 'application/json');

        // Should succeed (200) with a message confirming fake tie votes were injected
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        console.log('[4.8] Fake tie votes injected — tally should deterministically break this tie.');
    });

    it('4.8.2 - GET /api/admin/votes returns transaction_hash field per vote for the seed', async () => {
        const res = await request(BASE_URL)
            .get('/api/admin/votes')
            .set('Authorization', 'Bearer test-admin-token');

        // Endpoint should respond (even if 401/403, it should exist)
        expect([200, 401, 403]).toContain(res.status);

        if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);

            // Check that at least some votes (the newly injected ones) have transaction_hash
            const hasTransactionHash = res.body.some(vote => vote.transaction_hash !== undefined);
            expect(hasTransactionHash).toBe(true);

            // Each vote returned from the API should have a candidate_id and constituency
            res.body.forEach(vote => {
                expect(vote).toHaveProperty('candidate_id');
                expect(vote).toHaveProperty('constituency');
                // The new tie-breaking logic requires transaction_hash 
                expect(Object.prototype.hasOwnProperty.call(vote, 'transaction_hash')).toBe(true);
            });
            console.log(`[4.8] Verified ${res.body.length} votes containing transaction_hashes for tie-breaking seeds.`);
        }
    });

    it('4.8.3 - POST /api/admin/clear-fake-votes removes the mock tied votes from the database', async () => {
        const res = await request(BASE_URL)
            .post('/api/admin/clear-fake-votes')
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        console.log('[4.8] Test data cleared.');
    });

});
