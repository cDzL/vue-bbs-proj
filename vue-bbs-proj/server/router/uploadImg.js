const express = require('express')
const router = express.Router()
const handle = require('../router_handler/uploadImg')
router.post('/uploadImg',handle.uploadimg)
module.exports = router