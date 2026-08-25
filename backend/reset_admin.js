const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function resetAdminPassword() {
    try {
        console.log('Generating salt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        
        console.log('Updating database...');
        const res = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *',
            [hashedPassword, 'admin@gmail.com']
        );
        
        if (res.rows.length > 0) {
            console.log('Success! Password updated to: Admin@123');
        } else {
            console.log('User not found. Cannot update password.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

resetAdminPassword();
