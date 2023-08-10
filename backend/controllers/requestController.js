import asyncHandler from "express-async-handler";

import Request from "../models/requestModel.js";
import nodemailer from "nodemailer";

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

// @desc  Create Request
// @route POST /api/requests
// @access Private
const setRequest = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }

  const request = await Request.create({
    ...req.body,
    orgId: req.user.orgId,
  });

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
      from: '"Backplane Server" <lewis@backplane.cloud>', // sender address
      to: "lewis@backplane.cloud", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>${req.user.name}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);

  console.log(request);
  res.status(200).json(request);
});

// @desc  Update Request
// @route PUT /api/requests/:id
// @access Private
const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(400);
    throw new Error("Request not found");
  }

  const updatedRequest = await Request.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  console.log(updatedRequest);
  res.status(200).json(updatedRequest);
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

export { getRequest, getRequests, setRequest, updateRequest, deleteRequest };
