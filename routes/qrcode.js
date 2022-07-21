const express = require("express");
const router = express.Router();
const qrcodeController = require("../controller/qrcode");

router.post("/generate", qrcodeController.generate);
router.post("/scan", qrcodeController.scan);

module.exports = router;