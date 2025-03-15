
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getUsers);

// GET user by ID
router.get('/:id', userController.getUserById);

// GET user by RFID tag
router.get('/rfid/:rfidTag', userController.findUserByRfid);

// GET usage statistics for a user or all users
router.get('/stats/:userId', userController.getUserUsageStats);

// GET users by payment status (upcoming/overdue)
router.get('/payments/status', userController.getUsersByPaymentStatus);

// POST create a new user
router.post('/', userController.createUser);

// PUT update a user
router.put('/:id', userController.updateUser);

// PUT update user membership
router.put('/:id/membership', userController.updateMembership);

// POST record a payment
router.post('/:id/payment', userController.recordPayment);

// DELETE a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
