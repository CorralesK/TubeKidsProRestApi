const User = require("../models/userModel");

const { encryptPassword, createToken } = require('../helpers/authHelper.js');

const sendEmail = require('../helpers/emailHelper.js');
const sendSMS = require('../helpers/smsHelper.js');


const register = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: encryptPassword(req.body.password),
            pin: req.body.pin,
            name: req.body.name,
            lastName: req.body.lastName,
            country: req.body.country,
            dateBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            status: "pendiente"
        });

        const data = await user.save();

        sendEmail(data);
        const token = createToken(data);

        res.header({ 'location': `/api/users/?id=${data.id}` });
        res.status(201).json(token);
    } catch (error) {
        console.error('Error while saving the user:', error);
        res.status(422).json({ error: 'There was an error saving the user' });
    }
}


const login = async (req, res) => {
    try {
        if (!req.body.email && req.body.password) {
            return res.status(400).json({ error: 'Invalid request: email and password required' });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        if (user.status === 'pendiente') {
            return res.status(403).json({ error: 'User not verified' });
        }

        const hashedPassword = encryptPassword(req.body.password);

        if (user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = createToken(user);
        const authCode = sendSMS(user.phoneNumber);

        res.header({ 'location': `/api/users/?id=${user.id}` });
        res.status(201).json({ token: token, authCode: authCode });

    } catch (error) {
        console.error('Error while querying users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const updateStatus = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({ error: 'Invalid request: id is required' });
        }
        const user = await User.findById(req.body.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.status = 'activo';
        await user.save();

        res.status(201).json(user);

    } catch (error) {
        console.error('Error while updating user status:', error);
        return res.status(500).json({ error: 'Error while updating user status' });
    }
}


const userPinGet = async (req, res) => {
    try {
        if (req.userId) {
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({ error: "User doesn't exist" });
            }

            if (user.pin != req.query.pin) {
                return res.status(401).json({ error: 'Incorrect pin' });
            }

            return res.status(200).json(user);
        } else {
            return res.status(400).json({ error: 'User ID is required' });
        }
    } catch (error) {
        console.error('Error while getting user pin:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    register,
    login,
    updateStatus,
    userPinGet
}