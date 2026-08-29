const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('\n❌ CRITICAL ERROR: DATABASE_URL environment variable is NOT set!');
    console.error('Please configure DATABASE_URL in your Render Dashboard -> purazya-backend -> Environment.\n');
}

const pool = new Pool({
    connectionString: dbUrl,
    // Neon requires SSL
    ssl: dbUrl ? { rejectUnauthorized: false } : false
});

// Check connection
if (dbUrl) {
    pool.connect()
        .then(client => {
            console.log('✅ Database connected successfully via Neon PostgreSQL');
            client.release();
        })
        .catch(err => {
            console.error('❌ Database connection failed:', err.message);
        });
}

module.exports = pool;
