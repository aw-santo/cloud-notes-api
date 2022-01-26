const express = require("express");

const router = express.Router();

const User = require('../models/User');

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = require('../middleware/fetchuser');

// Route-1
// create a user using: POST "/api/auth/createuser" => no login required

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 chars').isLength({ min: 5 })
],
    async (req, res) => {
        // console.table(req.body);
        // const user = new User(req.body);
        // user.save();
        // res.json(req.body);

        const errors = validationResult(req);

        // if errors return bad req!

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // try-catch for any kind of error-handling

        try {
            // check whether the email already exist

            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).json({ error: "user with this email already exist!" });
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            // create new user

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            })
            const data = {
                user: {
                    id: user.id
                }
            };
            const auth_token = jwt.sign(data, JWT_SECRET);
            // console.json({ auth_token });

            res.json({ auth_token });
            // console.log(user);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    });


// Route-2
// Authenticate a user using: POST "/api/auth/login" => no login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 chars').isLength({ min: 5 })
],
    async (req, res) => {
        const errors = validationResult(req);

        // if errors return bad req!
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            let isThere = user && bcrypt.compareSync(req.body.password, user.password);

            if (!isThere) {
                return res.status(400).json({ error: "Enter valid credentials!🙂" })
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const auth_token = jwt.sign(data, JWT_SECRET);

            res.json({ auth_token });

            // res.send(`Hi ${user.name}✋, what's up?`);

        } catch (error) {

            console.error(error.message);
            res.status(500).send("Internal server error occured🚫");

        }

    });


// Route-3
// Get loggend in user details using : POST './api/auth/getuser'---Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {

        const userID = req.user.id;
        const user = await User.findById(userID).select('-password');
        // console.log(user);
        res.send(user);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal server error occured🚫");

    }

});

module.exports = router;