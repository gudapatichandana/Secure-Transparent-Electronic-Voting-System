const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/merug/Desktop/Secure-Transparent-Electronic-Voting-System/backend-api/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/evoting'
});

async function check() {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) FROM votes');
        console.log(`CURRENT VOTE COUNT: ${rows[0].count}`);

        const ledger = await pool.query('SELECT * FROM votes LIMIT 5');
        console.log('LATEST VOTES:', ledger.rows);
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await pool.end();
    }
}

check();
