const { Pool } = require('pg');
const crypto = require('crypto');

// Manually using the credentials from .env to ensure connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SecureVote',
    password: ' Sandeep0512',
    port: 5432,
});

async function seedFakeVotes() {
    const constituencies = ['Kuppam', 'Pulivendula', 'Pithapuram', 'Hindupur', 'Mangalagiri'];
    const candidates = ['CAND-001', 'CAND-002', 'CAND-003', 'CAND-004', 'CAND-005'];

    console.log('Seeding 5 mock votes into SecureVote (Standalone)...');

    try {
        for (let i = 0; i < 5; i++) {
            const transactionHash = crypto.randomBytes(32).toString('hex');
            const constituency = constituencies[i % constituencies.length];
            const candidateId = candidates[i % candidates.length];
            const voterId = crypto.createHash('sha256').update(`VOTER-${i}-${Date.now()}`).digest('hex');

            // Based on Vote.js: voter_id, candidate_id, constituency, transaction_hash
            await pool.query(
                'INSERT INTO votes (voter_id, candidate_id, constituency, transaction_hash) VALUES ($1, $2, $3, $4)',
                [voterId, candidateId, constituency, transactionHash]
            );
            console.log(`Injected vote for ${constituency} - Hash: ${transactionHash.substring(0, 10)}...`);
        }
        console.log('SUCCESS: Mock votes seeded.');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await pool.end();
    }
}

seedFakeVotes();
