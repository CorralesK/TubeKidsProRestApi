require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/**
 * Function for encrypting a password using SHA-256
 * 
 * @param {string} password  - The plain text password to be encrypted.
 */
const encryptPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Function to create a JWT token containing only essential user information.
 * 
 * @param {Object} user - User object containing relevant data.
 * @returns {string} - A JSON Web Token.
 */
function createToken(user) {
    const secretKey = process.env.SECRET_KEY;

    const tokenData = {
        id: user._id,
        email: user.email,
        password: user.password,
        pin: user.pin
    };

    const token = jwt.sign(tokenData, secretKey, { expiresIn: '12h' });
    return token;
}

module.exports = {
    encryptPassword,
    createToken
}