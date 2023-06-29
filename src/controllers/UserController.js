// Env vars
require('dotenv').config();

// Model
const User = require('../models/User');

// Dependencies
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Default attributes
const user_attributes = ["id", "name", "email", "username", "document", "document_type", "last_login", "created_at", "updated_at", "deleted_at"];

module.exports = {
    async index(req, res) {
        const users = await User.findAll({ 
            attributes: user_attributes 
        });
        if (!users || users.length === 0)
            return res.status(404).json({ 
                message: "No users found" 
            });
        return res.status(200).json({ 
            message: "Users found", users 
        });
    },
    async index_deleted(req, res) {
        const users = await User.findAll({ 
            attributes: user_attributes, 
            paranoid: false, 
            where: { 
                deleted_at: { [Op.not]: null } 
            } 
        });
        if (!users || users.length === 0) return res.status(404).json({
            message: "No deleted users found",
        });
        return res.status(200).json({
            message: "Deleted users found",
            users,
        });
    },
    async get (req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: user_attributes });
        if (!user) return res.status(404).json({ message: "User not found", description: "Could not find user by ID" });
        return res.status(200).json({ message: "User found", user });
    },
    async get_deleted (req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: user_attributes });
        if (user) return res.status(409).json({ message: "User not deleted", user });
        const deleted_user = await User.findOne({
            paranoid: false,
            where: {
                deleted_at: { [Op.not]: null },
                id
            }
        });
        if (!deleted_user) return res.status(404).json({
            message: "Deleted user not foud",
            description: "Could not find deleted user by ID",
        });
        return res.status(200).json({ 
            message: "User found", 
            deleted_user 
        });
    },
    async store(req, res) {
        const { name, email, username, document, document_type, pass } = req.body;
        const enc_pass = await encrypt_pass(pass);
        const exists = await user_exists(email, username, document);
        if (exists) return res.status(409).json({ 
            message: "Could not create user", 
            description: `This ${exists.attribute} is already taken`, 
            user: exists.user 
        });
        const user = await User.create({ 
            name, 
            email, 
            username, 
            document, 
            document_type, 
            enc_pass, 
            last_login: Date.now() 
        });
        if (!user) return res.status(502).json({ 
            message: "Could not create user" 
        });
        return res.status(201).json({ 
            message: "User created", user 
        });
    },
    async update (req, res) {
        const { id, name, email, username, document, document_type, last_login, pass } = req.body;
        const user = await User.findByPk(id, { attributes: [...user_attributes, "enc_pass"] });
        if (!user) return res.status(404).json({ message: "User not found", description: "Could not find user by ID" });
        const updated_user = await compare_user_attributes(user, name, email, username, document, document_type, last_login, pass);
        if (!updated_user.changed) return res.status(422).json({
            message: "There is nothing to update",
            user: updated_user.user
        });
        await updated_user.user.save();
        const new_user = await User.findByPk(id, { attributes: user_attributes });
        if (!new_user) return res.status(404).json({ message: "Could not find user after update" });
        return res.status(200).json({
            message: "User updated",
            user: new_user,
        });
    },
    async delete (req, res) {
        const { id } = req.body;
        const user = await User.findByPk(id, { paranoid: false, attributes: user_attributes });
        if (!user) return res.status(404).json({ message: "User not found", description: "Could not find user by ID" });
        if (user.deleted_at) return res.status(403).json({
            message: "User already deleted",
            user
        });
        const destroyed = await User.destroy({ where: { id } });
        if (!destroyed) return res.status(502).json({ 
            message: "Error while deleting user", 
            user: destroyed 
        });
        const deleted_user = await User.findOne({ 
            paranoid: false, 
            where: { 
                id, 
                deleted_at: { [Op.not]: null }
            }, 
            attributes: user_attributes 
        });
        if (!deleted_user) return res.status(404).json({ message: "Could not find user after delete it" });
        return res.status(200).json({
            message: "User deleted",
            user: deleted_user
        });
    },
    async restore (req, res) {
        const { id } = req.body;
        const user = await User.findByPk(id, { 
            paranoid: false,
            attributes: user_attributes 
        });
        if (!user) return res.status(404).json({
            message: "Deleted user not found"
        });
        if (!user.deleted_at) return res.status(403).json({
            message: "User not deleted",
            user
        });
        await User.restore({ where: { id } });
        const restored_user = await User.findByPk(id, { attributes: user_attributes });
        if (!restored_user) return res.status(404).json({
            message: "Could not find user after restore it",
        });
        return res.status(200).json({
            message: "User restored",
            user: restored_user,
        });
    },
}

async function encrypt_pass (pass) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const enc_pass = await bcrypt.hash(pass, salt);
    return enc_pass
}

async function user_exists(email, username, document) {
    if (email){
        const user_email = await User.findOne({ where: { email } });
        if (user_email) return { attribute: 'email', user: user_email };
    }
    if (username) {
        const user_username = await User.findOne({ where: { username } });
        if (user_username) return { attribute: 'username', user: user_username };
    }
    if (document) {
        const user_document = await User.findOne({ where: { document } });
        if (user_document) return { attribute: 'document', user: user_document };
    }
    return null;
}

async function compare_user_attributes(user, name, email, username, document, document_type, last_login, pass) {
    let changed = false;
    if (name) {
        if (user.name !== name){
            changed = true;
            user.name = name;
        }
    }
    if (email) {
        if (user.email !== email){
            changed = true;
            user.email = email;
        }
    }
    if (username) {
        if (user.username !== username){
            changed = true;
            user.username = username;
        }
    }
    if (document) {
        if (user.document !== document){
            changed = true;
            user.document = document;
        }
    }
    if (document_type) {
        if (user.document_type !== document_type){
            changed = true;
            user.document_type = document_type;
        }
    }
    if (last_login) {
        if (user.last_login !== last_login){
            changed = true;
            user.last_login = last_login;
        }
    }
    if (pass) {
        const compare = await bcrypt.compare(pass, user.enc_pass);
        if (!compare){
            const enc_pass = await encrypt_pass(pass);
            changed = true;
            user.enc_pass = enc_pass;
        }
    }
    if (!changed) user.enc_pass = undefined;
    return { changed, user };
}