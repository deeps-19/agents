const express = require("express");

const router = express.Router();

const {
  createInvestment,
  getInvestment,
  getClientInvestments,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investmentController");

router.post("/", createInvestment);

router.get(
  "/single/:id",
  getInvestment
);

router.get(
  "/client/:clientId",
  getClientInvestments
);

router.put(
  "/:id",
  updateInvestment
);

router.delete(
  "/delete/:id",
  deleteInvestment
);

module.exports = router;