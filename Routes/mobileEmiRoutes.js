import express from "express";
import {
  createMobileEmi,
  getAllMobileEmi,
  getMobileEmiById,
  updateMobileEmi,
  deleteMobileEmi
} from "../Controller/mobileEmiController.js";
import { authorizeRoles } from "../Middleware/Auth.js";

const router = express.Router();

router.post("/create",authorizeRoles("super admin", "admin"), createMobileEmi);
router.get("/all", authorizeRoles("super admin", "admin"), getAllMobileEmi);
router.get("/:id", authorizeRoles("super admin", "admin"), getMobileEmiById);
router.put("/update/:id", authorizeRoles("super admin", "admin"), updateMobileEmi);
router.delete("/delete/:id", authorizeRoles("super admin", "admin"), deleteMobileEmi);

export default router;
