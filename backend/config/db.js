const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires SSL
    ssl: {
        rejectUnauthorized: false
    }
});

// Check connection
pool.connect()
    .then(client => {
        console.log('Database connected successfully via Neon');
        client.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool;
