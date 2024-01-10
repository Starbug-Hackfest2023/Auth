const express = require('express');

const userAuth = require('../middlewares/userAuth');

const router = express.Router();

const authController = require('../modules/authController');

router.post('/loginUser', authController.loginUser);
router.post('/loginShop', authController.loginShop);
router.post('/registerUser', authController.registerUser);
router.post('/registerShop', authController.registerShop);

module.exports = router; 