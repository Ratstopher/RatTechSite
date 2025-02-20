const crypto = require('crypto');
const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const securityConfig = {
    encryption: {
        encrypt: (text) => {
            const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            return {
                encryptedData: encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex')
            };
        },
        
        decrypt: (encrypted, iv, authTag) => {
            const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    },
    
    hash: (data) => {
        return crypto.createHash('sha256').update(data).digest('hex');
    },
    
    generateToken: () => {
        return crypto.randomBytes(32).toString('hex');
    }
};

module.exports = securityConfig; 