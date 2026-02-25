const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createInvestment,
  getInvestments,
    updateInvestment,
  deleteInvestment,
  markAsPaid

} = require("../controllers/investmentController");

router.use(authMiddleware);

router.post("/:clientId", createInvestment);
router.get("/:clientId", getInvestments);
router.put("/update/:id", updateInvestment);
router.delete("/delete/:id", deleteInvestment);
router.put("/mark-paid/:id", markAsPaid);
router.get("/single/:id", authMiddleware, investmentController.getSingleInvestment);
module.exports = router;