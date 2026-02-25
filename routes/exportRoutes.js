const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { exportExcel, exportPDF } = require("../controllers/exportController");

router.get("/excel", authMiddleware, exportExcel);
router.get("/pdf", authMiddleware, exportPDF);

module.exports = router;