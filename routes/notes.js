const express = require("express");

const router = express.Router();

const fetchuser = require('../middleware/fetchuser');

const Notes = require('../models/Note');

const { body, validationResult } = require('express-validator');

// Route 1
// fetch all notes of user using: GET "/api/notes/fetchallnotes" =>  login required

router.get('/fetchallnotes', fetchuser,
    async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id });
            res.json(notes);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    });


// Route 2
// add a new note using: POST "/api/notes/addnote" =>  login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('desc', 'Enter a valid desc').isLength({ min: 1 })
],
    async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // console.log("after errors");

            const { title, desc, tag } = req.body;
            // console.log("req.body destruc");
            const note = await Notes.create({
                title,
                desc,
                tag,
                user: req.user.id
            });
            // console.log("Notes.creste");
            res.json(note);
            // console.log("sent res");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    });


// Route 3
// update a note using: PUT "/api/notes/updatenote/:id" =>  login required
//here :id is is of the note!

router.put('/updatenote/:id', fetchuser,
    async (req, res) => {
        try {
            const { title, desc, tag } = req.body;
            const newNote = {};

            if (title) { newNote.title = title; }
            if (desc) { newNote.desc = desc; }
            if (tag) { newNote.tag = tag; }

            // find the note to be updated and update it!
            let oldNote = await Notes.findById(req.params.id);

            if (!oldNote) {
                return res.status(404).send("Not found!");
            }

            // Authorization
            if (oldNote.user.toString() !== req.user.id) {
                return res.status(401).send("Permission denied");
            }

            oldNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }); // oldNote is updated now

            res.json(oldNote);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    });


// Route 4
// Delete a note using: DELETE "/api/notes/deletenote/:id" =>  login required
//here :id is is of the note!

router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {
        try {

            // find the note to be deleted and delete it!
            let note = await Notes.findById(req.params.id);

            if (!note) {
                return res.status(404).send("Not found!");
            }

            // Authorization
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Permission denied");
            }
            let q = await Notes.findByIdAndDelete(req.params.id);
            res.send("Note deleted!");

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    });

module.exports = router;