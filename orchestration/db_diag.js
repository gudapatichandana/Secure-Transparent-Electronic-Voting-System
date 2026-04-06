const { Client } = require('pg');

async function testConnection() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'SecureVote',
        password: ' Sandeep0512',
        port: 5432,
    });

    try {
        console.log('Attempting to connect to PostgreSQL...');
        await client.connect();
        console.log('CONNECTION SUCCESSFUL!');

        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);

        const countRes = await client.query('SELECT COUNT(*) FROM votes');
        console.log('Current votes:', countRes.rows[0].count);

    } catch (err) {
        console.error('--- CONNECTION FAILED ---');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Stack Trace:', err.stack);
    } finally {
        await client.end();
    }
}

testConnection();
