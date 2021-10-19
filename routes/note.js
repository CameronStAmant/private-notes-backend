const express = require('express');
const router = express.Router();

const note_controller = require('../controllers/noteController');

router.get('/', note_controller.note_list);

router.post('/create', note_controller.note_create_post);

router.delete('/:id/delete', note_controller.note_delete_post);

router.put('/:id/update', note_controller.note_update_post);

router.get('/:id', note_controller.note_detail);

module.exports = router;
