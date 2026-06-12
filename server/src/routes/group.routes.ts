import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  getGroupBalances,
  getGroupDetails,
  getGroupMembers,
  getMyGroups,
  updateGroup,
} from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createGroupValidation } from "../validations/group.validation";

const router = Router();

router.post("/", authMiddleware, createGroupValidation, createGroup);

router.get("/", authMiddleware, getMyGroups);

router.get("/:groupId", authMiddleware, getGroupDetails);

router.get("/:groupId/members", authMiddleware, getGroupMembers);

router.put("/:groupId", authMiddleware, updateGroup);

router.delete("/:groupId", authMiddleware, deleteGroup);

router.get("/:groupId/balances", authMiddleware, getGroupBalances);

export default router;
