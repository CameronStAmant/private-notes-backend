const express = require('express');
const router = express.Router();

const folder_controller = require('../controllers/folderController');

router.get('/', folder_controller.GET_folders);

router.post('/', folder_controller.POST_folder);

router.get('/:id', folder_controller.GET_folder);

router.delete('/:id', folder_controller.DELETE_folder);

router.put('/:id', folder_controller.PUT_folder);

module.exports = router;
