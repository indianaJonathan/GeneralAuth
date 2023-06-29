// Env vars
require('dotenv').config();

// Model
const User = require('../models/User');

// Dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Default attributes
const user_attributes = ["id", "name", "email", "username", "document", "document_type", "last_login", "created_at", "updated_at", "deleted_at"];

module.exports = {
    async login (req, res) {
        const { username, email, pass, remember } = req.body;
        const user = await User.findOne( username ? { where: { username } } : { where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });
        const compare = await bcrypt.compare(pass, user.enc_pass);
        if (!compare) return res.status(401).json({ message: "Wrong password" });
        user.last_login = Date.now();
        await user.save();
        let token_body = {
            user_id: user.id,
            user_email: user.email,
            username: user.username,
            login: Date.now(),
        }
        const token = jwt.sign(token_body, process.env.JWT_SECRET, !remember ? { expiresIn: '1d' } : null);
        const expires = remember ? undefined : new Date(user.last_login.setDate((user.last_login.getDate() + 1))).toISOString();
        return res.status(200).json({
            message: "Authorized",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            expires
        });
    },

    async me (req, res) {
        const token = req.headers ? (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null) : null;
        if (!token) return res.status(401).json({
            message: "Could not retrieve token",
        });
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) return res.status(401).json({
                message: "Could not decode token",
            });
            const user = await User.findByPk(decode.user_id, { attributes: user_attributes });
            if (!user) return res.status(404).json({
                message: "User not found by ID",
            });
            return res.status(200).json({
                message: "User found",
                user,
            });
        } catch (err) {
            return res.status(401).json({
                message: "Invalid token",
                description: err.message,
            });
        }
    },
    async forgot_password (req, res) {
        const { username, email } = req.body;
        const user = await User.findOne({ where: username ? { username } : { email } });
        if (!user) return res.status(404).json({
            message: "User not found",
        });
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '30min' });
        return res.status(200).json({
            message: "Password reset token created",
            token,
        });
    },
    async reset_password (req, res) {
        const { pass } = req.body;
        const token = req.headers ? (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null) : null;
        if (!token) return res.status(404).json({
            message: "Could not retrieve token",
        });
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) return res.status(401).json({
                message: "Could not decode token",
            });
            const user = await User.findByPk(decode.user_id);
            if (!user) return res.status(404).json({
                message: "User not found",
            });
            const enc_pass = await encrypt_pass(pass);
            user.enc_pass = enc_pass;
            await user.save();
            const updated_user = await User.findByPk(decode.user_id, { attributes: user_attributes });
            return res.status(200).json({
                message: "Password updated",
                user: updated_user,
            });
        } catch (err) {
            return res.status(401).json({
                message: "Invalid token",
                description: err.message
            });
        }
    }
}

async function encrypt_pass (pass) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const enc_pass = await bcrypt.hash(pass, salt);
    return enc_pass
}