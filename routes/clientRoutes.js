const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createClient, getClients } = require("../controllers/clientController");

router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);

module.exports = router;