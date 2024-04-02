import asyncHandler from "express-async-handler";

import Team from "../models/teamModel.js";
import User from "../models/userModel.js";
import { viewHTMXify, HTMXify } from "../htmx/HTMXify.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = ["name", "code", "members", "scope", "ownerId", "orgId"];

// @desc  Get Teams
// @route GET /api/teams
// @access Private
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );

  if (teams) {
    if (req.headers.ui) {
      let HTML = HTMXify(teams, fields, "Teams", "teams");
      res.send(HTML);
    } else {
      res.status(200).json(teams);
    }
  } else {
    res.status(400);
    throw new Error("No Teams Found");
  }
});

// @desc  Get Team
// @route GET /api/teams/:id
// @access Private
const getTeam = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Team
  console.log(req.headers.ui);

  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["name", "description", "scope"],
      "Create Team",
      "teams",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const team = await Team.findById(req.params.id);
    if (team) {
      if (req.headers.ui) {
        let HTML = viewHTMXify(
          team,
          fields,
          team.name,
          "teams",
          req.headers.action
        );
        res.send(HTML);
      } else {
        res.status(200).json(team);
      }
    } else {
      res.status(400);
      throw new Error("No Teams Found");
    }
  }
});

// @desc  Create Team
// @route POST /api/teams
// @access Private
const setTeam = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  let code = req.body.name.toLowerCase().replace(" ", "-");
  const team = await Team.create({
    name: req.body.name,
    code,
    //members: req.body.members,
    owners: req.body.owner,
    scope: `/orgs/${req.user.orgId}${req.body.scope}`,
    orgId: req.body.orgid || req.user.orgId,
  });
  console.log(team);
  // res.status(200).json(team);

  if (req.headers.ui) {
    let HTML = viewHTMXify(team, fields, team.name, "teams");
    res.send(HTML);
  } else {
    res.status(200).json(team);
  }
});

// @desc  Update Team
// @route PUT /api/teams/:id
// @access Private
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  const teamBody = {
    ...req.body,
    members: [...req.body.members],
    // name: req.body.name,
    // code: req.body.code,
    // scope: req.body.scope,
  };
  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, teamBody, {
    new: true,
  });

  if (req.headers.ui) {
    let HTML = viewHTMXify(updatedTeam, fields, "Team", "teams");
    res.send(HTML);
  } else {
    res.status(200).json(updatedTeam);
  }
});

// @desc  Delete Team
// @route DELETE /api/teams/:id
// @access Private
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).deleteOne();

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  if (req.headers.ui) {
    let HTML = "Team Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get Team Members
// @route GET /api/teams/:id/members
// @access Private
const getTeamMembers = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  res.status(200).json(team.members);
});

// @desc   Add Team Members
// @route  PUT /api/teams/:id/members
// @access Private
const updateTeamMembers = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }
  if (!req.body.members) {
    console.log("No Members Provided");
    return;
  }

  let teamMembers = req.body.members.split(",");
  teamMembers.map((o) => {
    if (!team.members.includes(o.trim())) {
      // Add member to Team
      team.members.push(o.trim());

      // Update member team access list
      updateMember(o.trim(), req.params.id, "push");
    }
  });

  await team.save();
  res.status(200).json(teamMembers);
});

// @desc  Delete Team Members
// @route DELETE /api/teams/:id/members/remove
// @access Private
const deleteTeamMembers = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  let teamMembers = req.body.members.split(",");

  teamMembers.map((o) => {
    console.log("processing:", o);
    if (team.members.includes(o)) {
      // Remove member from Team
      console.log(`Removing ${o} from team`);
      let i = team.members.filter((t) => t != o);
      team.members = i;

      // Update member team access list
      console.log(`Syncing User and removing ${o} from user.teams`);
      updateMember(o, req.params.id, "pop");
    }
  });
  await team.save();
  res.status(200).json(teamMembers);
});

// @desc  Delete Team Owners
// @route DELETE /api/teams/:id/owners/remove
// @access Private
const deleteTeamOwners = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  let teamOwners = req.body.owners.split(",");

  teamOwners.map((o) => {
    console.log("processing:", o);
    if (team.owners.includes(o)) {
      // Remove member from Team
      console.log(`Removing ${o} from team`);
      let i = team.owners.filter((t) => t != o);
      team.owners = i;

      // // Update member team access list
      // console.log(`Syncing User and removing ${o} from user.teams`);
      // updateMember(o, req.params.id, "pop");
    }
  });
  await team.save();
  res.status(200).json(teamOwners);
});

// Utility Function to Update User.Teams to sync Team membership
const updateMember = async (uid, id, action) => {
  let user = await User.findById(uid); // Get User
  console.log(`${action}ing ${user.name} to Team: ${id}`);
  if (action === "push" && !user.teams.includes(id)) {
    await user.teams.push(id);
    console.log("pushed");
  } // Push Team ID to user.teams array.

  if (action === "pop" && user.teams.includes(id)) {
    let i = user.teams.filter((team) => team != id);
    console.log("New Teams:", i);
    user.teams = i;
    console.log("popped");
  }
  await user.save();
};

// @desc  Get Team Owners
// @route GET /api/teams/:id/members
// @access Private
const getTeamOwners = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }

  res.status(200).json(team.owners);
});

// @desc  Add Team Owners
// @route PUT /api/teams/:id/owners
// @access Private
const updateTeamOwners = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  let teamOwners = req.body.owners.split(",");

  teamOwners.map((o) => {
    !team.owners.includes(o.trim()) && team.owners.push(o.trim());
  });

  await team.save();
  res.status(200).json(teamOwners);
});

// @desc  Delete Team Owners
// @route DELETE /api/teams/:id/owners
// @access Private
// const deleteTeamOwners = asyncHandler(async (req, res) => {
//   const team = await Team.findById(req.params.id);
//   console.log(team.owners);
//   let teamArr = req.body.owners.split(",");
//   console.log(teamArr);

//   teamArr.map((o) => {
//     team.owners.includes(o.trim()) && team.owners.pop(o.trim());
//   });

//   await team.save();
//   res.status(200).json(team.owners);
// });

// @desc  Check Team Member
// @route GET /api/teams/:id/members/:uid
// @access Private
const isMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  console.log(req.params.uid);
  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }
  console.log(team.members);
  const exists = team.members.includes(req.params.uid);
  console.log(exists);

  exists ? res.status(200).send(true) : res.status(200).send(false);
});

// @desc  Check Team Owner
// @route GET /api/teams/:id/owners/:uid
// @access Private
const isOwner = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }
  const exists = team.owners.includes(req.params.uid);
  console.log(exists);

  exists ? res.status(200).send(true) : res.status(404).send(false);
});

export {
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
};
