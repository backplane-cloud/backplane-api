import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Org from "../models/orgModel.js";

import generateToken from "../utils/generateToken.js";

import nodemailer from "nodemailer";
import EventEmitter from "events";

import logger from "../utils/logger.js";

import {
  getUserAssignments,
  getTeamAssignments,
  setAssignment,
} from "../controllers/assignmentController.js";
import {
  setInternalRole,
  getInternalRoleActions,
} from "../controllers/roleController.js";

import { setOrg } from "../controllers/orgController.js";

//create an object of EventEmitter class by using above reference
const events = new EventEmitter();

events.on("newUserRegistered", async function (name, email, orgId, userType) {
  const org = await Org.findById(orgId);

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
      subject: `Welcome to Backplane ${name}!`, // Subject line
      text: "", // plain text body
      html: `
<h2>Welcome, ${name}</h2>
        
Your Backplane Cloud Abstraction API has been setup for your organisation, <b>${org.name}</b>

<br/><br/>
<b>Username</b>: ${email}<br/>
<b>User Type</b>: ${userType}

<h2>Next Steps</h2>

<h3>Login</h3>
<ol>
  <li>Download & Install <a href='https://cli.backplane.dev/cli.zip'>Backplane CLI</a></li>
  <li>Login: <b>bp auth login -e ${email} -p *****</li>
</ol>

<h3>Cloud Provisioning Setup</h3>
  <ul>
    <li>Register a Cloud Provider (<a href=''>Read AWS, Azure and GCP documentation)</a>)</li>
    <li>Register Repo Provider (<a href=''>Github documentation</li>
  </ul>

<h3>Org Administration</h3>
  <ul>
    <li>Create Platform</li>
    <li>Create Product</li>
    <li>Create Users</li>
    <li>...</li>
  </ul>

  <h3>Developer</h3>
    <ul>
      <li>Create App</li>
    </ul>
    
    Example: - bp app add --displayname MyApp --cloud Azure

        `, // html body
    });
    //console.log(info);
    //console.log("Message sent: %s", info.messageId);
    logger.info(`Message sent: ${info.messageId}`);
    //winston.error("here is an error message");

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
});

// @desc    Get Users
// route    GET /api/users
// @access  Private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );

  if (users) {
    res.status(200).json(users);
    //console.log(req);
    logger.info("Retrieving Users", {
      caller: req.user.name,
      org: req.user.orgId,
    });
  } else {
    res.status(404);
    //throw new Error("No Users found");
    logger.error(new Error("No users Found"));
  }
});

// @desc    Get a User
// route    GET /api/users/:id
// @access  Private

const getUser = asyncHandler(async (req, res) => {
  logger.info("Get a User", {
    caller: req.user.name,
    org: req.user.orgId,
    url: req.baseUrl,
    method: req.method,
  });

  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json(user);
  } else {
    // throw new Error("No Users found");
    logger.warn("No users Found");
    res.status(404).send("No Users Found");
  }
});
// @desc    Get a User
// route    GET /api/users/:id
// @access  Private

const getUserInternal = asyncHandler(async (req, res) => {
  console.log("get user");
  const user = await User.findById(req);

  if (user) {
    return user;
    //res.status(200).json(user);
  } else {
    res.status(404);
    //throw new Error("No Users found");
    logger.warn("No users Found");
  }
});

// @desc    Register a new user
// route    POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  logger.info("User Registration", {
    url: req.baseUrl,
    method: req.method,
  });

  //const { name, email, password, userType, orgName } = req.body

  // Validate data supplied
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Please add name, email and password");
  }

  // Check User doesn't already exist
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create Org
  let name = req.body.orgName;
  // let owner = "1";
  const org = await setOrg({ name });
  console.log("org:", org);

  // Create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userType: "Organisation Owner",
    orgId: org.id,
  });
  console.log("Created User", User.name);

  // Update Owner on Org
  await Org.findByIdAndUpdate(org.id, { ownerId: user.id });
  console.log("Updated Org Owner ID", Org.name);

  // Create Role
  const role = await setInternalRole({
    name: `Org Owner for ${org.name}`,
    type: "builtin",
    allowActions: [`/write`, `/delete`, `/read`],
    orgId: org.id,
  });
  console.log(role);

  // Create Assignment
  setAssignment({
    type: "user",
    principal: user.id,
    principalRef: "User",
    scope: `/orgs/${org.id}`,
    role: role.id,
    orgId: org.id,
  });

  // Create Contributor and Reader RBAC Roles for Org
  await setInternalRole({
    name: `Contributor for ${org.name}`,
    type: "builtin",
    allowActions: [`/write`, `/delete`],
    orgId: org.id,
  });

  await setInternalRole({
    name: `Reader for ${org.name}`,
    type: "builtin",
    allowActions: [`/read`],
    orgId: org.id,
  });

  // Raise Event to Send Welcome E-mail
  events.emit(
    "newUserRegistered",
    req.body.name,
    req.body.email,
    org.id,
    req.body.userType
  );

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      orgId: user.orgId,
      userType: user.userType,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Create a new user within existing Org
// route    POST /api/users/create
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Validate data supplied
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add name, email and password");
  }

  // Check User doesn't already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    //orgId,
    orgId: req.user.orgId,
    userType,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      orgId: user.orgId,
      userType: user.userType,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login User (Set JWT Token in HTTP Read Only Cookie)
// route    POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    const token = generateToken(res, user._id);
    // console.log(
    //   `User ${email} has successfully signed in. JWT Token: \n${token}`
    // );
    logger.info(`Successful authentication for ${email}`, {
      user: email,
      name: user.name,
      orgId: user.orgId.toString(),
      allowedActions: user.allowedActions,
      userType: user.userType,
    });
    // Retrieve Allowed Actions

    //console.log("Action:", action);
    const uid = user.id;
    const orgid = user.orgId;

    // Get User Assignments
    const userAssignments = await getUserAssignments({ id: uid, orgId: orgid });
    //console.log(`User Assignments: ${userAssignments}`);

    // Get User Actions
    const userActions = await Promise.all(
      userAssignments.map(async (assignment) =>
        getInternalRoleActions(assignment.role, assignment.scope, orgid)
      )
    );
    // console.log(userActions);
    // return;

    // Get Team Assignments
    const teamAssignments = await getTeamAssignments();
    // console.log(teamAssignments);
    // return;

    // Filter the Teams to those that the User is a member of
    const filteredTeams = teamAssignments.filter(
      (assignment) => {
        return user.teams.includes(assignment.principal);
      } //&& assignment
    );
    // console.log(`Team Assignments: ${filteredTeams}`);
    // return;

    // Get Team Actions
    const filteredRoles = await Promise.all(
      filteredTeams.map(async (assignment) =>
        getInternalRoleActions(assignment.role, assignment.scope, orgid)
      )
    );
    //console.log("Team Actions:", filteredRoles);

    // Merge Actions
    const allActions = [...userActions, ...filteredRoles];

    const allowedActions = allActions.flat();
    // const newAllowedActions = allowedActions.map((action) =>
    //   action != "*" ? `/orgs/${req.user.orgId}${action}` : "*"
    // );
    //console.log(actions);
    // console.log(allowedActions);
    // return;

    user.allowedActions = allowedActions;
    user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      orgId: user.orgId,
      userType: user.userType,
      allowedActions,
      token,
    });
  } else {
    res
      .status(401)
      .send(`Authentication Failed for ${email}, Invalid email or password`);
    // //throw new Error("Invalid email or password");
    logger.error(
      new Error(`Authentication Failed for ${email}, Invalid email or password`)
    );
  }
});

// @desc    Logout user
// route    POST /api/users/logout
// @access  Public

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
  logger.info(`${req.user.email} Logged Out`);
});

// @desc    Get Logged In User
// route    GET /api/users/me
// @access  Private

const getMe = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    orgId: req.user.orgId,
    userType: req.user.userType,
    allowedActions: req.user.allowedActions,
  };

  res.status(200).json(user);
});

// @desc    Update Logged in User
// route    PUT /api/users/me
// @access  Private

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.orgId = req.body.orgID || user.orgId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      orgId: updatedUser.orgId,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  //res.status(200).json({ message: "Update User Profile" });
});

// @desc    Update a User Profile
// route    PUT /api/users/:id
// @access  Private

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.orgId = req.body.orgId || user.orgId;
    user.userType = req.body.userType || user.userType;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      orgId: updatedUser.orgId,
      userType: updatedUser.userType,
    });
  } else {
    res.status(404);
    logger.warn("UPDATE USER: User not found");
  }
  //res.status(200).json({ message: "Update User Profile" });
});

// @desc  Delete User
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).deleteOne();

  if (!user) {
    res.status(400);
    // throw new Error("USer not found");
    logger.warn("DELETE USER: User Not Found");
  }

  res.status(200).json({ id: req.params.id });
});

export {
  getUser,
  getUsers,
  updateUser,
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateMe,
  deleteUser,
  getUserInternal,
  createUser,
};
