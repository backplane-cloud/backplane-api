import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

import {
  getUserAssignments,
  getTeamAssignments,
  getAssignments,
} from "../controllers/assignmentController.js";
import {
  getInternalRoles,
  getInternalRoleActions,
} from "../controllers/roleController.js";

// @desc    Get Users
// route    GET /api/users
// @access  Private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("No Users found");
  }
});

// @desc    Get a User
// route    GET /api/users
// @access  Private

const getUser = asyncHandler(async (req, res) => {
  console.log("get user");
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("No Users found");
  }
});
// @desc    Get a User
// route    GET /api/users
// @access  Private

const getUserInternal = asyncHandler(async (req, res) => {
  console.log("get user");
  const user = await User.findById(req);

  if (user) {
    return user;
    //res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("No Users found");
  }
});

// @desc    Register a new user
// route    POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, orgId, userType } = req.body;

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
    orgId,
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
    console.log(
      `User ${email} has successfully signed in. JWT Token: \n${token}`
    );

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
    res.status(401);
    throw new Error("Invalid email or password");
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
    throw new Error("User not found");
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
    throw new Error("USer not found");
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
