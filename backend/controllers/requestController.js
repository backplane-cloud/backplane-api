import asyncHandler from "express-async-handler";

import Request from "../models/requestModel.js";
import nodemailer from "nodemailer";
import EventEmitter from "events";

import User from "../models/userModel.js";
import App from "../models/appModel.js";
import Product from "../models/productModel.js";
import Platform from "../models/platformModel.js";
import Org from "../models/orgModel.js";

import {
  createResource,
  listResources,
  showResource,
} from "../views/resource.js";

import { resourceOverviewTab } from "../views/tabs.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = [
  "_id",
  "orgId",
  "type",
  "requestType",
  "data",
  "approvalCode",
  "approver",
  "requestedBy",
  "requestedForType",
  "requestedForId",
  "approvalStatus",
];

const tabs = ["Overview"];

// EVENT CODE

//create an object of EventEmitter class by using above reference
const events = new EventEmitter();

// Create Event Listener for Request Approval/Rejection
events.on("approvalRequest", async function (id, approvalStatus, data) {
  // Get Request
  const request = await Request.findById(id);
  console.log("Approval Request Received for");
  // Get Requester
  const requester = await User.findById(request.requestedBy);
  console.log("Approval Status:", request.approvalStatus);
  if (request.approvalStatus === "approved") {
    // REQUEST - LINK
    console.log("Request is approved");

    if (request.requestType === "link") {
      // Add the App ID to Product.apps
      const product = await Product.findById(request.requestedForId);

      if (product.apps.includes(data)) {
        console.log(`Requested App is already linked to ${product.name}`);
        return;
      }

      product.apps.push(request.data);
      await product.save();

      // Update App with parent Product ID
      const app = await App.findById(request.data);
      app.productId = request.requestedForId;
      await app.save();
    }

    // REQUEST - BUDGET
    if (request.requestType === "budget") {
      console.log("Request for Budget");
      if (request.requestedForType === "product") {
        console.log("Request for Product Budget");

        const product = await Product.findById(request.requestedForId);
        const platform = await Platform.findById(product.platformId);

        // Update Budget Allocated on Parent Platform
        const currentBudget = platform.budget[platform.budget.length - 1];
        platform.budget.pop(); // Remove last budget and replace with updated Budget

        // Increase budget allocated
        console.log("current budget allocated:", currentBudget.budgetAllocated);
        console.log("request data:", request.data);
        const budgetAllocated =
          parseInt(currentBudget.budgetAllocated) + parseInt(request.data);
        console.log("budget allocated:", budgetAllocated);

        if (budgetAllocated <= currentBudget.budget) {
          //Check budget allocation doesn't exceed budget
          const updatedBudget = {
            year: currentBudget.year,
            budget: currentBudget.budget,
            budgetAllocated,
            currency: currentBudget.currency,
          };
          platform.budget.push(updatedBudget);
          platform.save();

          // Add Budget to Product
          const budget = {
            year: "2023",
            budget: request.data,
            currency: "USD",
            approvalId: request.id,
          };
          product.budget = [budget];
          product.save();
        } else {
          approvalStatus = "Insufficient Budget available";
        }
      }

      if (request.requestedForType === "platform") {
        // Update Budget Allocated on Parent Org
        const platform = await Platform.findById(request.requestedForId);
        const org = await Org.findById(platform.orgId);
        const currentBudget = org.budget[org.budget.length - 1];

        org.budget.pop(); // Remove last budget and replace with updated Budget
        const budgetAllocated =
          parseInt(currentBudget.budgetAllocated) + parseInt(request.data);
        console.log("budget allocated:", budgetAllocated);

        if (budgetAllocated <= currentBudget.budget) {
          //Check budget allocation doesn't exceed budget
          const updatedBudget = {
            year: currentBudget.year,
            budget: currentBudget.budget,
            budgetAllocated,
            currency: currentBudget.currency,
          };
          org.budget.push(updatedBudget);
          org.save();

          // Add Budget to Platform
          const budget = {
            year: "2024",
            budget: request.data,
            currency: "USD",
            budgetAllocated: 0,
            approvalId: request.id,
          };
          console.log("platform budget:", budget);
          platform.budget = [budget];
          platform.save();
        } else {
          approvalStatus = "Insufficient Budget available";
        }
      }
    }
  }

  console.log(`Request ${approvalStatus}`);
  // Enter Code here for budget approval or applink approval.
  const transporter = nodemailer.createTransport({
    host: "smtp.mailersend.net",
    port: 587,
    //secure: true,
    auth: {
      user: process.env.MAILSENDER_USERNAME,
      pass: process.env.MAILSENDER_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Backplane" <lewis@backplane.cloud>', // sender address
      to: requester.email, //"lewis@backplane.cloud", // list of receivers
      subject: `Your Request status: ${approvalStatus}`, // Subject line
      text: "Hello world?", // plain text body
      html: `Request with ID <b>${request.id}</b> status: ${approvalStatus}.`, // html body
    });
    //console.log(info);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
});

// Create an Event Listener for approval Request Created.
events.on(
  "approvalRequestCreated",
  async function (id, requestType, approvalCode, approver) {
    // Get Approver E-mail Address
    const { email } = await User.findById(approver);

    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net",
      port: 587,
      //secure: true,
      auth: {
        user: process.env.MAILSENDER_USERNAME,
        pass: process.env.MAILSENDER_PASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Backplane" <lewis@backplane.cloud>', // sender address
        to: email, //"lewis@backplane.cloud", // list of receivers
        subject: `Approval Request `, // Subject line
        text: "Hello world?", // plain text body
        html: `An ${requestType} approval request requires your approval: </b> <a href='http://localhost:8000/api/requests/${id}/approve?code=${approvalCode}'>Click here to Approve</a>
        or <a href='http://localhost:8000/api/requests/${id}/reject?code=${approvalCode}'>Click here to Reject</a>


        <h2>Request Details</h2>
        <table>
        <tr>
          <td>Request Type:</td><td>${requestType}</td>
        </tr>

        </table>
        `, // html body
      });
      //console.log(info);
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
  }
);

// @desc  Get Requests
// @route GET /api/requests
// @access Private
const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (requests) {
    if (req.headers.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(
        requests,
        fields,
        "Requests",
        "Requests",
        showbreadcrumb
      );
      res.send(HTML);
    } else {
      res.status(200).json(requests);
    }
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
});

// @desc  Get  a Request
// @route GET /api/requests/:id
// @access Private
const getRequest = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Request
  console.log(req.headers.action);

  const request = await Request.findById(req.params.id);
  if (request) {
    // Need to update Request model with 'type' to replace requestType for consistency.
    // let xrequest = {
    //   ...request,
    //   type: "request",
    // };
    if (req.headers.ui) {
      let breadcrumbs = `requests,${request.requestType}`;
      let HTML = showResource(request, tabs, breadcrumbs);
      // let HTML = createResource(
      //   request,
      //   fields,
      //   "Request",
      //   "requests",
      //   req.headers.action
      // );
      res.send(HTML);
    } else {
      res.status(200).json(request);
    }
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
});

// @desc  Create Request UI
// @route GET /api/requests/create
// @access Private
const createRequestUI = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Request
  console.log(req.headers.action);

  let HTML = createResource(
    {},
    ["requestType", "requestedForType", "requestedForId", "data"],
    "Create Request",
    "requests",
    req.headers.action
  );
  res.send(HTML);
});

// @desc  Get My Requests
// @route GET /api/requests/me
// @access Private
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requestedBy: req.user.id });

  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
});

// @desc  Create Request
// @route POST /api/requests
// @access Private
const setRequest = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }
  const approvalCode = Math.random().toString().substring(2, 10);
  const requestedBy = req.user.id;
  const orgId = req.user.orgId;
  const requestedForId = req.body.requestedForId;

  // Get the Object that Approval is sought for
  let approver;
  switch (req.body.requestedForType) {
    case "org":
      approver = await Org.findById(requestedForId);
      break;
    case "platform":
      approver = await Platform.findById(requestedForId);

      break;
    case "product":
      const product = await Product.findById(requestedForId);
      approver = await Platform.findById(product.platformId);
      break;

    case "app":
      approver = await App.findById(requestedForId);
      break;
  }

  const request = await Request.create({
    ...req.body,
    requestedBy,
    orgId,
    approvalCode,
    approver: approver.ownerId,
    type: "request",
    approvalStatus: "pending",
  });

  // Raising FirstEvent
  events.emit(
    "approvalRequestCreated",
    request.id,
    request.requestType,
    request.approvalCode,
    request.approver
  );

  console.log(request);
  // res.status(200).json(request);

  if (req.headers.ui) {
    // let HTML = createResource(request, fields, "Request", "requests");
    // res.send(HTML);
    let breadcrumbs = `requests,${request.id}`;
    let HTML = showResource(request, tabs, breadcrumbs);
    res.send(HTML);
  } else {
    res.status(200).json(request);
  }
});

// @desc  Update Request
// @route PUT /api/requests/:id
// @access Private
const updateRequest = asyncHandler(async (req, res) => {
  const updatedRequest = await Request.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedRequest) {
    res.status(400);
    throw new Error("Request not found");
  }
  console.log(updatedRequest);
  // res.status(200).json(updatedRequest);

  if (req.headers.ui) {
    let HTML = createResource(updatedRequest, fields, "Request", "requests");
    res.send(HTML);
  } else {
    res.status(200).json(updatedRequest);
  }
});

// @desc  Approve Request
// @route GET /api/requests/:id/approve
// @access Private
const approveRequest = asyncHandler(async (req, res) => {
  console.log("approving request", req.params.id);
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(400);
    throw new Error("Request not found");
  }
  console.log("payload:", request.approvalCode, req.query.code);
  if (request.approvalCode === req.query.code) {
    console.log("Approval Code Successfully Validated");
    if (
      request.approvalStatus != "approved" &&
      request.approvalStatus != "rejected"
    ) {
      request.approvalStatus = "approved";
      request.save();
      console.log("Emitting Approval Event");
      events.emit(
        "approvalRequest",
        request.id,
        request.approvalStatus,
        request.data
      );
    } else {
      res.send("Request already approved");
      return;
    }
  } else {
    res.send("Invalid Approval Code");
    return;
  }

  console.log(request);
  res.status(200).json("Request Successfully Approved");
});

// @desc  Reject Request
// @route GET /api/requests/:id/reject
// @access Private
const rejectRequest = asyncHandler(async (req, res) => {
  console.log("Rejecting Request", req.params.id);
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(400);
    throw new Error("Request not found");
  }

  if (request.approvalCode === req.query.code) {
    if (
      request.approvalStatus != "rejected" &&
      request.approvalStatus != "approved"
    ) {
      request.approvalStatus = "rejected";
      request.save();
      events.emit("approvalRequest", request.id, request.approvalStatus);
    } else {
      res.send("Request already rejected");
      return;
    }
  } else {
    res.send("Invalid Approval Code");
    return;
  }

  console.log(request);
  res.status(200).json("Request Successfully Rejected");
});

// @desc  Delete Request
// @route DELETE /api/requests/:id
// @access Private
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).deleteOne();

  if (!request) {
    res.status(400);
    throw new Error("Request not found");
  }

  if (req.headers.ui) {
    let HTML = "Request Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get Request Overview Tab
// @route GET /api/requests/:id/overview
// @access Private
const getRequestOverviewTab = asyncHandler(async (req, res) => {
  console.log("id = ", req.params.id);
  const request = await Request.findById(req.params.id);
  console.log(request);
  if (request) {
    if (req.headers.ui) {
      let HTML = resourceOverviewTab(request, fields, req.headers.action);
      res.send(HTML);
    } else {
      res.status(200).json(app);
    }
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
});

export {
  getRequest,
  getRequests,
  setRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
  getMyRequests,
  createRequestUI,
  getRequestOverviewTab,
};
