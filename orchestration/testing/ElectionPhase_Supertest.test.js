/**
 * Module 5.1 - Election Phase State Machine
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 5.1.1 - GET /api/election/status returns current phase
 * 5.1.2 - POST /api/election/update transitions phase correctly
 * 5.1.3 - POST /api/vote returns 'Election Not Started' when in PRE_POLL
 * 5.1.4 - POST /api/vote returns 'Election Has Ended' when in POST_POLL
 * 5.1.5 - Restore phase back to LIVE after tests
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/ElectionPhase_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000';

describe('Module 5.1 - Election Phase State Machine (Supertest)', () => {

    it('5.1.1 - GET /api/election/status returns valid phase object', async () => {
        const res = await request(BASE_URL).get('/api/election/status');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('phase');
        expect(['PRE_POLL', 'LIVE', 'POST_POLL']).toContain(res.body.phase);
        expect(res.body).toHaveProperty('is_kill_switch_active');
        console.log(`[5.1.1] Current phase: ${res.body.phase}, Kill switch: ${res.body.is_kill_switch_active}`);
    });

    it('5.1.2 - POST /api/election/update transitions phase to PRE_POLL', async () => {
        const res = await request(BASE_URL)
            .post('/api/election/update')
            .set('Content-Type', 'application/json')
            .send({ phase: 'PRE_POLL' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        console.log('[5.1.2] Phase transitioned to PRE_POLL successfully.');
    });

    it('5.1.3 - POST /api/vote returns Election Not Started when phase is PRE_POLL', async () => {
        const res = await request(BASE_URL)
            .post('/api/vote')
            .set('Content-Type', 'application/json')
            .send({});

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'Election Not Started');
        console.log('[5.1.3] Voting correctly blocked with "Election Not Started".');
    });

    it('5.1.4 - POST /api/vote returns Election Has Ended when phase is POST_POLL', async () => {
        // Transition to POST_POLL
        await request(BASE_URL)
            .post('/api/election/update')
            .send({ phase: 'POST_POLL' });

        const res = await request(BASE_URL)
            .post('/api/vote')
            .set('Content-Type', 'application/json')
            .send({});

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'Election Has Ended');
        console.log('[5.1.4] Voting correctly blocked with "Election Has Ended".');
    });

    it('5.1.5 - Restore phase to LIVE after all tests', async () => {
        const res = await request(BASE_URL)
            .post('/api/election/update')
            .send({ phase: 'LIVE', isKillSwitch: false });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);

        // Confirm it's LIVE again
        const statusRes = await request(BASE_URL).get('/api/election/status');
        expect(statusRes.body.phase).toBe('LIVE');
        console.log('[5.1.5] Phase restored to LIVE. All tests complete.');
    });

});
