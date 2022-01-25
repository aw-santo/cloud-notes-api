const express = require("express");

const router = express.Router();

const User = require('../models/User');


// create a user using: POST "/api/auth/" => doesnt require Authentication
router.post('/', (req, res) => {
    console.table(req.body);
    const user = new User(req.body);
    user.save();
    res.json(req.body);
})

module.exports = router;