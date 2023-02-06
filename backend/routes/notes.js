const express = require("express");
const router = express.Router();
const fetchUser = require("../middelware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: Get All the notes using Get /api/notes/fetchAllNotes Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal serve error");
  }
});

// Route 2: Add a new notes using Post /api/notes/addnote Login required
router.post(
  "/addnote",
  fetchUser,
  body("title", "Enter a title min of 3").isLength({ min: 3 }),
  body("description", "Enter a description of min of 5").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors returns bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      res.status(500).send("Internal serve error");
    }
  }
);

// Route 3: Add a new notes using put /api/notes/updatenote Login required
router.put(
  "/updatenote/:id",
  fetchUser,
  // body("title", "Enter a title min of 3").isLength({ min: 3 }),
  // body("description", "Enter a description of min of 5").isLength({ min: 5 }),
  async (req, res) => {
    const { title, description, tag } = req.body;
    // create new note object

    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  }
);
module.exports = router;
