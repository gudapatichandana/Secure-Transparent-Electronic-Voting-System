/**
 * Module 5.4 - Voter Receipt Search
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 5.4.1.1 - Verify receipt with valid hash
 * 5.4.3.1 - Verify receipt with invalid hash
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/ReceiptSearch_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5000';

describe('Module 5.4 - Voter Receipt Search (Supertest)', () => {

    let validHash = '';

    beforeAll(async () => {
        // Fetch a valid hash to test with
        const ledgerRes = await request(BASE_URL).get('/api/public-ledger');
        if (ledgerRes.body && ledgerRes.body.length > 0) {
            validHash = ledgerRes.body[0].transaction_hash;
        }
    });

    it('5.4.1.1 - Verify valid receipt returns block number', async () => {
        if (!validHash) return; // Skip if no votes exist

        const res = await request(BASE_URL)
            .post('/api/verify-receipt')
            .send({ transactionHash: validHash });

        expect(res.status).toBe(200);
        expect(res.body.verified).toBe(true);
        expect(res.body).toHaveProperty('vote');
        expect(res.body.vote).toHaveProperty('blockNumber');
        expect(res.body.vote.transactionHash).toBe(validHash);

        console.log(`[5.4.1] Valid receipt verified successfully. Block: #${res.body.vote.blockNumber}`);
    });

    it('5.4.3.1 - Verify invalid hash returns false/Not Found', async () => {
        const invalidHash = '0'.repeat(64);
        const res = await request(BASE_URL)
            .post('/api/verify-receipt')
            .send({ transactionHash: invalidHash });

        expect(res.status).toBe(200);
        expect(res.body.verified).toBe(false);
        expect(res.body.message).toMatch(/not found/i);

        console.log(`[5.4.3] Invalid receipt correctly rejected.`);
    });

    it('Should reject malformed hashes (wrong length)', async () => {
        const res = await request(BASE_URL)
            .post('/api/verify-receipt')
            .send({ transactionHash: 'short_hash' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

});
