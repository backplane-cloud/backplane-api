import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();

// Azure Routes
import {
  getAzureCost,
  getAzurePolicy,
} from "../controllers/clouds/azureController.js";
router.route("/azure/cost/:id").get(protect, authz, getAzureCost);
router.route("/azure/policy/:id").get(protect, authz, getAzurePolicy);

import { getAzureAccess } from "@backplane-software/backplane-azure";

router.route("/azure/access/:id").get(protect, authz, getAzureAccess);

// GCP Routes
import {
  getGCPCost,
  getGCPAccess,
  getGCPPolicy,
  createGCPEnvironments,
} from "@backplane-software/backplane-gcp";

router.route("/gcp/cost/:id").get(protect, authz, getGCPCost);
router.route("/gcp/access/:id").get(protect, authz, getGCPAccess);
router.route("/gcp/policy/:id").get(protect, authz, getGCPPolicy);

// AWS Routes
import {
  getAWSCost,
  getAWSAccess,
  getAWSPolicy,
  createAWSEnv,
} from "@backplane-software/backplane-aws";

router.route("/aws/cost/:id").get(protect, authz, getAWSCost);
router.route("/aws/access/:id").get(protect, authz, getAWSAccess);
router.route("/aws/policy/:id").get(protect, authz, getAWSPolicy);
router.route("/aws/environment").post(protect, authz, createAWSEnv);

export default router;
