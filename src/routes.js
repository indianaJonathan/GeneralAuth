// Dependencies
const express = require('express');

//Controllers
const users = require('./controllers/UserController');

const router = express.Router();

// User
router.get('/user', users.index); // Get all users (not deleted)
router.get('/user/deleted', users.index_deleted); // Get all deleted users
router.get('/user/:id', users.get); // Get specific user (not deleted)
router.get('/user/deleted/:id', users.get_deleted); // Get specific deleted user
router.post('/user', users.store); // Create user
router.put('/user', users.update); // Update user
router.delete('/user', users.delete); // Delete user
router.put('/user/restore', users.restore); // Restore deleted user

module.exports = router;