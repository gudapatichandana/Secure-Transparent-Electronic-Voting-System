/**
 * Module 5.2 - Candidate Management CRUD
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 5.2.1 - Set PRE_POLL
 * 5.2.2 - POST /api/candidate adds test candidate
 * 5.2.3 - GET /api/candidates shows the new candidate (5.2.3.1)
 * 5.2.4 - PUT /api/candidate/:id updates candidate
 * 5.2.5 - DELETE /api/candidate/:id removes candidate (5.2.3.1)
 * 5.2.6 - PUT blocked during LIVE (ballot locked)
 * 5.2.7 - DELETE blocked during LIVE (ballot locked)
 * 5.2.8 - Restore LIVE
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/CandidateCRUD_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000';
let testCandidateId = null;

describe('Module 5.2 - Candidate Management CRUD (Supertest)', () => {

    it('5.2.1 - Set election to PRE_POLL to unlock ballot', async () => {
        const res = await request(BASE_URL)
            .post('/api/election/update')
            .send({ phase: 'PRE_POLL' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        console.log('[5.2.1] Phase set to PRE_POLL.');
    });

    it('5.2.2 - POST /api/candidate adds a test candidate', async () => {
        const res = await request(BASE_URL)
            .post('/api/candidate')
            .send({
                name: 'Supertest Candidate',
                party: 'Supertest Party',
                symbol: '🧪',
                constituency: 'Wyra'
            });
        expect(res.status).toBe(201);
        console.log('[5.2.2] Test candidate added.');
    });

    it('5.2.3 - GET /api/candidates shows the new candidate on ballot', async () => {
        const res = await request(BASE_URL)
            .get('/api/candidates')
            .query({ constituency: 'Wyra' });
        expect(res.status).toBe(200);
        const match = res.body.filter(c => c.name === 'Supertest Candidate');
        expect(match.length).toBeGreaterThan(0);
        testCandidateId = match[0].id;
        console.log(`[5.2.3] Test candidate found on ballot, id=${testCandidateId}.`);
    });

    it('5.2.4 - PUT /api/candidate/:id updates the candidate', async () => {
        const res = await request(BASE_URL)
            .put(`/api/candidate/${testCandidateId}`)
            .send({ name: 'Updated Supertest', party: 'Updated Party', symbol: '✅' });
        expect(res.status).toBe(200);
        expect(res.body.candidate.name).toBe('Updated Supertest');
        expect(res.body.candidate.symbol).toBe('✅');
        console.log(`[5.2.4] Candidate id=${testCandidateId} updated.`);
    });

    it('5.2.5 - DELETE /api/candidate/:id removes candidate from ballot', async () => {
        const res = await request(BASE_URL).delete(`/api/candidate/${testCandidateId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify removed from ballot
        const check = await request(BASE_URL).get('/api/candidates').query({ constituency: 'Wyra' });
        const remaining = check.body.filter(c => c.name === 'Updated Supertest');
        expect(remaining.length).toBe(0);
        console.log('[5.2.5] Candidate deleted and removed from ballot.');
    });

    it('5.2.6 - PUT blocked during LIVE (ballot locked)', async () => {
        await request(BASE_URL).post('/api/election/update').send({ phase: 'LIVE' });
        const res = await request(BASE_URL)
            .put('/api/candidate/1')
            .send({ name: 'Hacked', party: 'Hacked', symbol: '💀' });
        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/locked/i);
        console.log('[5.2.6] PUT correctly blocked during LIVE.');
    });

    it('5.2.7 - DELETE blocked during LIVE (ballot locked)', async () => {
        const res = await request(BASE_URL).delete('/api/candidate/1');
        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/locked/i);
        console.log('[5.2.7] DELETE correctly blocked during LIVE.');
    });

    it('5.2.8 - Restore phase to LIVE after tests', async () => {
        const res = await request(BASE_URL).post('/api/election/update').send({ phase: 'LIVE' });
        expect(res.status).toBe(200);
        console.log('[5.2.8] Phase restored to LIVE. All tests complete.');
    });

});
