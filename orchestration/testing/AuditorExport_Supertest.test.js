/**
 * Module 5.5 - Auditor Data Export
 * Supertest / Vitest Integration Tests
 *
 * Tests:
 * 5.5.1.1 - Secure Data Export returns a .zip file
 * 5.5.3.1 - Exported file is valid and cryptographically signed
 *
 * Run from backend-api/:
 *   npx vitest run ../testing/AuditorExport_Supertest.test.js
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import * as crypto from 'crypto';
import AdmZip from 'adm-zip';

const BASE_URL = 'http://localhost:5001';

describe('Module 5.5 - Auditor Data Export (Supertest)', () => {

    it('5.5.1.1 & 5.5.3.1 - GET /api/observer/export-ledger returns verifiable signed zip', async () => {
        const res = await request(BASE_URL)
            .get('/api/observer/export-ledger')
            .responseType('blob'); // Important for binary files

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/zip/);
        expect(res.headers['content-disposition']).toMatch(/secure_voting_ledger_export.zip/);

        // Parse the zip file from the response buffer
        const zip = new AdmZip(res.body);
        const zipEntries = zip.getEntries();

        expect(zipEntries.length).toBeGreaterThanOrEqual(3);

        // Extract contents memory
        const ledgerJsonBuffer = zip.readFile('ledger.json');
        const signatureBuffer = zip.readFile('signature.sha256');

        expect(ledgerJsonBuffer).not.toBeNull();
        expect(signatureBuffer).not.toBeNull();

        const ledgerContent = ledgerJsonBuffer.toString('utf8');
        const providedSignature = signatureBuffer.toString('utf8');

        // Re-calculate the HMAC signature using the simulated signing key
        const secretKey = process.env.JWT_SECRET || 'eci_secure_export_key_2026';
        const expectedHmac = crypto.createHmac('sha256', secretKey)
            .update(ledgerContent)
            .digest('hex');

        // 5.5.3.1 - Cryptographic Verification
        expect(providedSignature).toBe(expectedHmac);

        console.log(`[5.5.3] ZIP downloaded and signature verified successfully!`);
    });

});
