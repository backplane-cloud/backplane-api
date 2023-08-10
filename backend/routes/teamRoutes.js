import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getTeam,
  getTeams,
  setTeam,
  updateTeam,
  deleteTeam,
  updateTeamMembers,
  deleteTeamMembers,
  getTeamMembers,
  getTeamOwners,
  updateTeamOwners,
  deleteTeamOwners,
  isMember,
  isOwner,
} from "../controllers/teamController.js";

router.route("/").get(protect, authz, getTeams).post(protect, authz, setTeam);
router
  .route("/:id")
  .get(protect, authz, getTeam)
  .put(protect, authz, updateTeam)
  .delete(protect, authz, deleteTeam);

router
  .route("/:id/members")
  .get(protect, authz, getTeamMembers)
  .patch(protect, authz, updateTeamMembers);

router.route("/:id/members/remove").patch(protect, authz, deleteTeamMembers);

router
  .route("/:id/owners")
  .get(protect, authz, getTeamOwners)
  .patch(protect, authz, updateTeamOwners);

router.route("/:id/owners/remove").patch(protect, authz, deleteTeamOwners);

router.route("/:id/members/:uid").get(protect, authz, isMember);
router.route("/:id/owners/:uid").get(protect, authz, isOwner);

export default router;
