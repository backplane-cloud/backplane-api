import asyncHandler from "express-async-handler";

import Role from "../models/roleModel.js";

// @desc  Get Roles
// @route GET /api/roles
// @access Private
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  if (roles) {
    res.status(200).json(roles);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

const getInternalRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  if (roles) {
    return roles;
    //res.status(200).json(roles);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Get Role
// @route GET /api/roles/:id
// @access Private
const getRole = asyncHandler(async (req, res) => {
  const roles = await Role.findById(req.params.id);
  if (roles) {
    res.status(200).json(roles);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Get Role Actions
// @route GET /api/roles/:id/actions
// @access Private
const getRoleActions = asyncHandler(async (req, res) => {
  const roles = await Role.findById(req.params.id);
  if (roles) {
    res.status(200).json(roles.allowActions);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Get Role Actions
// @route GET /api/roles/:id/actions
// @access Private
const getInternalRoleActions = asyncHandler(async (roleid, scope, orgid) => {
  const role = await Role.findById(roleid);

  if (role) {
    const scopedActions = role.allowActions.map(
      (action) => `${scope}${action}`
      // !scope.includes("/orgs")
      //   ? `/orgs/${orgid}${scope}${action}`
      //   : `${scope}${action}`
    );
    return scopedActions; //role.allowActions;
    //res.status(200).json(roles.allowActions);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Create Role
// @route POST /api/roles
// @access Private
const setRole = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }
  let orgId = req.user.userType != "root" && req.user.orgId;
  const role = await Role.create({
    ...req.body,
    orgId,
  });
  console.log(role);
  res.status(200).json(role);
});

// @desc  Update Role
// @route PUT /api/roles/:id
// @access Private
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  if (req.body.allowActions) {
    let allowActions = req.body.allowActions.split(",");
    let updateObj = {
      ...req.body,
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    // console.log(allowActions);
    // console.log(typeof allowActions);
    // return;
  } else {
    updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  }

  console.log(updatedRole);
  res.status(200).json(updatedRole);
});

// @desc  Update Role Actions
// @route PUT /api/roles/:id/actions
// @access Private
const updateRoleActions = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  if (req.body.allowActions) {
    let allowActions = req.body.allowActions.split(",");
    let updateObj = {
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
  }

  console.log(updatedRole);
  res.status(200).json(updatedRole);
});

// @desc  Delete Role Actions
// @route PATCH /api/roles/:id/actions
// @access Private
const deleteRoleActions = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }
  let allowActions = role.allowActions.filter(
    (action) => action != req.body.allowActions
  );
  if (req.body.allowActions) {
    let updateObj = {
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
  }

  console.log(updatedRole);
  res.status(200).json(updatedRole);
});

// @desc  Delete Role
// @route DELETE /api/roles/:id
// @access Private
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).deleteOne();

  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  res.status(200).json({ id: req.params.id });
});

export {
  getRole,
  getRoles,
  setRole,
  updateRole,
  deleteRole,
  getRoleActions,
  updateRoleActions,
  deleteRoleActions,
  getInternalRoles,
  getInternalRoleActions,
};
