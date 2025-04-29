import { Router } from "express";
import { verifyPayment, initializePayment } from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/initialize", protect, initializePayment);
router.post("/verify", protect, verifyPayment);

export default router;
