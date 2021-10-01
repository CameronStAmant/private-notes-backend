const express = require('express');
const router = express.Router();

const note_controller = require('../controllers/noteController');

router.get('/', note_controller.note_list);

router.get('/create', note_controller.note_create_get);

router.post('/create', note_controller.note_create_post);

router.get('/:id/delete', note_controller.note_delete_get);

router.post('/:id/delete', note_controller.note_delete_post);

router.get('/:id/update', note_controller.note_update_get);

router.post('/:id/update', note_controller.note_update_post);

router.get('/:id', note_controller.note_detail);

module.exports = router;
