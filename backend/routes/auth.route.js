const express = require('express');
const router = express.Router();
const googleAuth = require('../controller/auth.controller');


router.get('/google', googleAuth)

module.exports = router;