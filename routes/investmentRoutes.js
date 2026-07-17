const express=require("express");
const authMiddleware = require("../middleware/authMiddleware")
const router=express.Router();

const investment=require("../controllers/investmentController");

router.post("/",investment.createInvestment);

router.get("/",investment.getInvestments);

router.get("/upcoming",investment.upcomingPremiums);

router.get("/client/:clientId",investment.getClientInvestments);

router.get("/:id",investment.getInvestment);

router.put("/:id",investment.updateInvestment);

router.delete("/:id",investment.deleteInvestment);
router.get("/my", authMiddleware, investment.getMyInvestments);

module.exports=router;