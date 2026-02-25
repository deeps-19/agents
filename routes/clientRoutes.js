const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createClient, getClients, getClientById } = require("../controllers/clientController");

router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);
router.get("/client/:id", authMiddleware, getClientById);
module.exports = router;