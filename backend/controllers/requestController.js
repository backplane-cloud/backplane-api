import asyncHandler from "express-async-handler";

import Request from "../models/requestModel.js";
import nodemailer from "nodemailer";
import EventEmitter from "events";

import User from "../models/userModel.js";
import App from "../models/appModel.js";
import Product from "../models/productModel.js";
import Platform from "../models/platformModel.js";

// EVENT CODE

//create an object of EventEmitter class by using above reference
const events = new EventEmitter();

// Create an Event Listener for approval Request Created.
events.on("approvalRequest", async function (id, approvalStatus, data) {
  // Get Request
  const request = await Request.findById(id);

  // Get Requester
  const requester = await User.findById(request.requestedBy);

  if (request.requestType === "applink") {
    const product = await Product.findById(request.requestedForId);
    if (product.apps.includes(data)) {
      console.log(`Requested App is already linked to ${product.name}`);
      return;
    }
    product.apps.push(request.data);
    product.save();
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
      subject: `Your Request has been ${approvalStatus}`, // Subject line
      text: "Hello world?", // plain text body
      html: `Request with ID <b>${request.id}</b> has been ${approvalStatus}.`, // html body
    });
    //console.log(info);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
});

events.on(
  "approvalRequestCreated",
  async function (id, requestType, approvalCode, approver) {
    // Get Approve E-mail Address
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
  const requests = await Request.find();
  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
});

// @desc  Get Request
// @route GET /api/requests/:id
// @access Private
const getRequest = asyncHandler(async (req, res) => {
  const requests = await Request.findById(req.params.id);
  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found");
  }
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
      approver = await Product.findById(requestedForId);
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
  res.status(200).json(request);
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
  res.status(200).json(updatedRequest);
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

  if (request.approvalCode === req.query.code) {
    if (
      request.approvalStatus != "approved" &&
      request.approvalStatus != "rejected"
    ) {
      request.approvalStatus = "approved";
      request.save();
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

  res.status(200).json({ id: req.params.id });
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
};
