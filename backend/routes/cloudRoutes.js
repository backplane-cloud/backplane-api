import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getAzureCost,
  getAzureAccess,
  getAzurePolicy,
} from "../controllers/clouds/azureController.js";

import {
  getGCPCost,
  getGCPAccess,
  getGCPPolicy,
} from "../controllers/clouds/gcpController.js";

import {
  getAWSCost,
  getAWSAccess,
  getAWSPolicy,
} from "../controllers/clouds/awsController.js";

router.route("/azure/cost/:id").get(protect, authz, getAzureCost);
router.route("/azure/access/:id").get(protect, authz, getAzureAccess);
router.route("/azure/policy/:id").get(protect, authz, getAzurePolicy);

router.route("/gcp/cost/:id").get(protect, authz, getGCPCost);
router.route("/gcp/access/:id").get(protect, authz, getGCPAccess);
router.route("/gcp/policy/:id").get(protect, authz, getGCPPolicy);

router.route("/aws/cost/:id").get(protect, authz, getAWSCost);
router.route("/aws/access/:id").get(protect, authz, getAWSAccess);
router.route("/aws/policy/:id").get(protect, authz, getAWSPolicy);

export default router;
