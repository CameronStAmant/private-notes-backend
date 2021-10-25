const express = require('express');
const router = express.Router();

const note_controller = require('../controllers/noteController');

router.get('/', note_controller.GET_notes);

router.post('/create', note_controller.POST_note);

router.delete('/delete-many-notes', note_controller.DELETE_many_notes);

router.delete('/:id', note_controller.DELETE_note);

router.put('/:id', note_controller.PUT_note);

router.get('/:id', note_controller.GET_note);

module.exports = router;
