const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);

router.post('/auth', authController.loginUser);

module.exports = router;