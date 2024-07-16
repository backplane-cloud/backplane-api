import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Org from "../models/orgModel.js";
import pkg from "../../package.json" assert { type: "json" };

import {
  registerHTMX,
  createResource,
  listResources,
  showResource,
} from "../views/resource.js";
import { appshell } from "../views/appshell.js";

import { resourceOverviewTab } from "../views/tabs.js";

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
        
The organisation <b>${org.name}</b> has been successfully created. 

<h2>What's next ? </h2>

<h3>Download CLI</h3>
Download & Install <a href='https://backplane.dev/blog/cli/'>Backplane CLI</a>

<h3>Login</h3>
bp auth login --email ${email} --password <password>

<h3>Documentation</h3>
<a href='https://backplane.dev/blog/'>Backplane Tutorials</a>
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

const fields = [
  "name",
  "email",
  "orgId",
  "teams",
  "userType",
  "allowedActions",
];

const tabs = ["Overview"];

// @desc    Get Users
// route    GET /api/users
// @access  Private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );

  if (users) {
    if (req.headers.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(users, fields, "Users", "users", showbreadcrumb);
      res.send(HTML);
    } else {
      res.status(200).json(users);
    }
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
  // Handles return of HTMX for Create New Platform
  console.log(req.headers.action);

  if (req.headers.action === "create") {
    let HTML = createResource(
      {},
      ["name", "email", "password", "userType"],
      "Create User",
      "users",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const user = await User.findById(req.params.id);

    if (user) {
      if (req.headers.ui) {
        let breadcrumbs = `users,${user.name}`;
        let HTML = showResource(user, tabs, breadcrumbs);
        // let HTML = createResource(
        //   user,
        //   fields,
        //   user.name,
        //   "users",
        //   req.headers.action
        // );
        res.send(HTML);
      } else {
        res.status(200).json(user);
      }
    } else {
      // throw new Error("No Users found");
      logger.warn("No users Found");
      res.status(404).send("No Users Found");
    }
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

// @desc    Register a new user HTMX Form
// route    GET /api/users/register
// @access  Public

const registerUserUI = asyncHandler(async (req, res) => {
  console.log("here i am");
  // res.send(registerHTMX);
  let HTML = registerHTMX();
  res.send(HTML);
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
  console.log("Created User", user.name);

  // Update Owner on Org
  await Org.findByIdAndUpdate(org.id, { ownerId: user.id });
  console.log("Set Org Owner to", org.name);

  // Role Creation - Org Owner
  const role = await setInternalRole({
    name: `Org Owner for ${org.name}`,
    type: "builtin",
    allowActions: [`/write`, `/delete`, `/read`],
    orgId: org.id,
    ownerId: user.id,
  });

  // Role Creation - Contributor
  await setInternalRole({
    name: `Contributor for ${org.name}`,
    type: "builtin",
    allowActions: [`/write`, `/delete`],
    orgId: org.id,
    ownerId: user.id,
  });

  // Role Creation - Reader
  await setInternalRole({
    name: `Reader for ${org.name}`,
    type: "builtin",
    allowActions: [`/read`],
    orgId: org.id,
    ownerId: user.id,
  });

  // Role Assignment - Org Owner Role to Org Owner
  await setAssignment({
    type: "user",
    principal: user.id,
    principalRef: "user",
    scope: `/orgs/${org.id}`,
    role: role.id,
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

    if (req.headers.ui) {
      res.status(200).send("<login-form></login-form>");
    } else {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        userType: user.userType,
      });
    }
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

    if (req.headers.ui) {
      let HTML = createResource(user, fields, user.name, "users");
      res.send(HTML);
    } else {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        userType: user.userType,
      });
    }
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

    // Set Cookie upon Login only and not User Creation.
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 2592000000, // 30 days in ms
    });

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
    console.log(user);

    if (req.headers.ui) {
      res.status(200).send(appshell(user.name, user.email, user.orgId));
    } else {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        userType: user.userType,
        allowedActions,
        token,
      });
    }
  } else {
    if (req.headers.ui) {
      res.send("<login-form></login-form>");
    } else {
      res
        .status(401)
        .send(`Authentication Failed for ${email}, Invalid email or password`);
    }

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
  if (req.headers.ui) {
    let HTML = "<login-form></login-form>";
    res.send(HTML);
  } else {
    res.status(200).json({ message: "User Logged Out" });
  }
  // logger.info(`${req.user.email} Logged Out`);
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

// @desc    Check User is Authenticated
// route    GET /api/users/check-auth
// @access  Private
import jwt from "jsonwebtoken";
const checkAuth = asyncHandler(async (req, res) => {
  // const user = {
  //   _id: req.user._id,
  //   name: req.user.name,
  //   email: req.user.email,
  //   orgId: req.user.orgId,
  //   userType: req.user.userType,
  //   allowedActions: req.user.allowedActions,
  // };

  // res.status(200).json(user);

  //   let HTML = `
  //   <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  //   Welcome back ${req.user.name} <button type="submit" hx-headers='{"ui": true}' hx-post="/api/users/logout" hx-target="#loginSection">Logout</button>,
  // </div>
  //   `;
  //   res.send(HTML);
  let token;
  try {
    token = req.cookies.jwt
      ? req.cookies.jwt
      : req.headers.authorization.split(" ")[1]; // CLI - retrieve token from Authorization Header, replaces req.query.token;
  } catch (err) {
    // res.status(401);
    // throw new Error("Not authenticated, no token");
    if (req.headers.ui) {
      // res.send(loginHTMX({ message: "Invalid Username/Password" }));
      res.send(
        `<login-form version='${pkg.version}' release='${pkg.releaseName}'></login-form>`
      );
    }
    // logger.warn(`Not authenticated, No Token`);
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      res.send(appshell());
    } catch (error) {
      // res.status(401).send(`Not authenticated, Invalid Token`);
      // throw new Error("Not authenticated, invalid token");
      // logger.warn(new Error("Not authenticated, invalid token"));
    }
  } else {
    // res.send(loginHTMX({ message: "Invalid Username/Password" }));
    // throw new Error("Not authenticated, no token");
    // logger.warn(`Not authenticated, No Token`);
  }
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
    user.teams = req.body.teams || user.teams;
    user.type = req.body.type || user.type;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    if (req.headers.ui) {
      let HTML = createResource(updatedUser, fields, "User", "users");
      res.send(HTML);
    } else {
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        orgId: updatedUser.orgId,
        userType: updatedUser.userType,
      });
    }
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

  if (req.headers.ui) {
    let HTML = "User Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get User Overview
// @route GET /api/users/:id/overview
// @access Private
const getUserOverview = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (req.headers.ui) {
      let HTML = resourceOverviewTab(user, fields, req.headers.action);
      res.send(HTML);
    } else {
      res.status(200).json(app);
    }
  } else {
    res.status(400);
    throw new Error("No Users Found");
  }
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
  checkAuth,
  registerUserUI,
  getUserOverview,
};
