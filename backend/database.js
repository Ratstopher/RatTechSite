const { Pool } = require('pg');
const securityConfig = require('./security');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

const database = {
    async storeSecureData(data) {
        const encryptedData = securityConfig.encryption.encrypt(JSON.stringify(data));
        const query = `
            INSERT INTO secure_data (encrypted_data, iv, auth_tag)
            VALUES ($1, $2, $3)
            RETURNING id`;
        
        try {
            const result = await pool.query(query, [
                encryptedData.encryptedData,
                encryptedData.iv,
                encryptedData.authTag
            ]);
            return result.rows[0].id;
        } catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to store data securely');
        }
    },
    
    async retrieveSecureData(id) {
        const query = 'SELECT encrypted_data, iv, auth_tag FROM secure_data WHERE id = $1';
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            const decrypted = securityConfig.encryption.decrypt(
                row.encrypted_data,
                row.iv,
                row.auth_tag
            );
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to retrieve secure data');
        }
    }
};

module.exports = database; 