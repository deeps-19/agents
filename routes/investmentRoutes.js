const express = require("express");

const router = express.Router();

const {
  createInvestment,
  getInvestment,
  updateInvestment,
  getClientInvestments,
  deleteInvestment,
} = require("../controllers/investmentController");


// Create investment
router.post(
  "/",
  createInvestment
);


// Get single investment
router.get(
  "/single/:id",
  getInvestment
);


// Get all investments of client
router.get(
  "/client/:clientId",
  getClientInvestments
);


// Update investment
router.put(
  "/:id",
  updateInvestment
);


// Delete investment
router.delete(
  "/:id",
  deleteInvestment
);


module.exports = router;