const express = require("express");
const { NoteModel } = require("../models/note.model");
const { auth } = require("../middlewares/auth.middleware");

const noteRouter = express.Router();

noteRouter.use(auth);

noteRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ msg: "note has been added", note: req.body });
  } catch (error) {
    res.json({ error: error.message });
  }
});

noteRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.body.userId });
    res.send(notes);
  } catch (error) {
    res.json({ error: error.message });
  }
});

noteRouter.patch("/update/:noteId", async (req, res) => {
  //userIdInUserDoc===userIdInNoteDoc
  const userIdinUserDoc = req.body.userId;
  const { noteId } = req.params;

  try {
    const note = await NoteModel.findOne({ _id: noteId });
    const userIdinNoteDoc = note.userId;
    if (userIdinUserDoc === userIdinNoteDoc) {
      //logic
      await NoteModel.findByIdAndUpdate({ _id: noteId }, req.body);
      res.json({ msg: `${note.title} is updated` });
    } else {
      res.json({ msg: "not Authorized" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

noteRouter.delete("/delete/:noteId", async (req, res) => {
  //logic
  const { noteId } = req.params;
  const userIdinUserDoc = req.body.userId;

  try {
    const note = await NoteModel.findOne({ _id: noteId });
    const userIdinNoteDoc = note.userId;
    if (userIdinUserDoc === userIdinNoteDoc) {
      //update
      await NoteModel.findByIdAndDelete({ _id: noteId });
      res.json({ msg: `${note.title} is delete` });
    } else {
      res.json({ msg: "not authorized to delete" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

module.exports = {
  noteRouter,
};
