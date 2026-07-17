const express=require("express");
const authMiddleware = require("../middleware/authMiddleware")
const router=express.Router();

const investment=require("../controllers/investmentController");

router.post("/", authMiddleware, investment.createInvestment);

router.get("/", authMiddleware, investment.getInvestments);

router.get("/upcoming", authMiddleware, investment.upcomingPremiums);

router.get("/client/:clientId", authMiddleware, investment.getClientInvestments);

router.get("/:id", authMiddleware, investment.getInvestment);

router.put("/:id", authMiddleware, investment.updateInvestment);

router.delete("/:id", authMiddleware, investment.deleteInvestment);
router.get("/my", authMiddleware, investment.getMyInvestments);

module.exports=router;