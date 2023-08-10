import asyncHandler from "express-async-handler";
// import { getUserInternal } from "../controllers/userController.js";
// import {
//   getUserAssignments,
//   getTeamAssignments,
//   getAssignments,
// } from "../controllers/assignmentController.js";
// import {
//   getInternalRoles,
//   getInternalRoleActions,
// } from "../controllers/roleController.js";
// import Team from "../models/teamModel.js";

const authz = asyncHandler(async (req, res, next) => {
  console.time("AuthZ");

  console.log("AuthZ Middleware");
  console.log(`IDENTITY: ${req.user.orgId}\\${req.user.name}`);

  // Get User Action being Performed
  //console.log("baseurl:", req.baseUrl);

  let action = req.baseUrl.substring(4, req.baseUrl.length);
  let requestedAction = req.baseUrl.substring(4, req.baseUrl.length);
  console.log(req.method, action);

  let inferredAction;

  if (action != "/orgs") {
    switch (req.method) {
      case "GET":
        action = req.params.id
          ? `/orgs/${req.user.orgId}${action}/${req.params.id}/read`
          : `/orgs/${req.user.orgId}${action}/read`;
        break;
      case "PUT":
        action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
        break;
      case "POST":
        action = `/orgs/${req.user.orgId}${action}/write`;
        break;
      case "DELETE":
        action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
        break;
    }
  } else {
    switch (req.method) {
      case "GET":
        action = req.params.id
          ? `${action}/${req.params.id}/read`
          : `${action}/${req.user.orgId}/read`;
        break;
      case "PUT":
        action = `${action}/${req.params.id}/write`;
        break;
      case "POST":
        action = `${action}/${req.user.orgId}/write`;
        break;
      case "DELETE":
        action = `${action}/${req.user.orgId}/${req.params.id}/delete`;
        break;
    }
  }

  inferredAction = req.params.id
    ? action.replace(`${requestedAction}/${req.params.id}`, "")
    : action.replace(`${requestedAction}`, "");

  /*
  // ORGS
  if (action === "/orgs") {
    if (req.method === "GET") {
      action = req.params.id
        ? `${action}/${req.params.id}/read`
        : `${action}/${req.user.orgId}/read`;
    }
    if (req.method === "PUT") {
      action = `${action}/write`;
    }
    if (req.method === "POST") {
      action = "/"; //`${action}/${req.params.id}/write`;
    }
    if (req.method === "DELETE") {
      action = `${action}/${req.params.id}/delete`;
    }

    inferredAction = action;
  }

  // PLATFORM
  if (action === "/platforms") {
    if (req.method === "GET") {
      action = req.params.id
        ? `/orgs/${req.user.orgId}${action}/${req.params.id}/read`
        : `/orgs/${req.user.orgId}${action}/read`;
    }
    if (req.method === "PUT") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
    }
    if (req.method === "POST") {
      action = `/orgs/${req.user.orgId}${action}/write`;
    }
    if (req.method === "DELETE") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
    }

    inferredAction = req.params.id
      ? action.replace(`/platforms/${req.params.id}`, "")
      : action.replace(`/platforms`, "");
    // inferredAction = [inferredAction, "/*"];
  }

  // PRODUCT
  if (action === "/products") {
    if (req.method === "GET") {
      action = `/orgs/${req.user.orgId}${action}/read`;
    }
    if (req.method === "PUT") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
    }
    if (req.method === "POST") {
      action = `/orgs/${req.user.orgId}${action}/write`;
    }
    if (req.method === "DELETE") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
    }

    inferredAction = action.replace(`/products`, "");
  }

  if (action === "/apps") {
    if (req.method === "GET") {
      action = req.params.id
        ? `/orgs/${req.user.orgId}${action}/${req.params.id}/read` // Fully Qualified Action
        : `/orgs/${req.user.orgId}${action}/read`;
    }
    if (req.method === "PUT") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
    }
    if (req.method === "POST") {
      action = `/orgs/${req.user.orgId}${action}/write`;
    }
    if (req.method === "DELETE") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
    }

    inferredAction = req.params.id
      ? action.replace(`/apps/${req.params.id}`, "")
      : action.replace(`/apps`, "");
  }

  // REQUESTS
  if (action === "/requests") {
    if (req.method === "GET") {
      action = req.params.id
        ? `/orgs/${req.user.orgId}${action}/${req.params.id}/read`
        : `/orgs/${req.user.orgId}${action}/read`;
    }
    if (req.method === "PUT") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
    }
    if (req.method === "POST") {
      action = `/orgs/${req.user.orgId}${action}/write`;
    }
    if (req.method === "DELETE") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
    }

    inferredAction = req.params.id
      ? action.replace(`/requests/${req.params.id}`, "")
      : action.replace(`/requests`, "");
  }
  // SERVICES
  if (action === "/services") {
    if (req.method === "GET") {
      action = req.params.id
        ? `/orgs/${req.user.orgId}${action}/${req.params.id}/read`
        : `/orgs/${req.user.orgId}${action}/read`;
    }
    if (req.method === "PUT") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/write`;
    }
    if (req.method === "POST") {
      action = `/orgs/${req.user.orgId}${action}/write`;
    }
    if (req.method === "DELETE") {
      action = `/orgs/${req.user.orgId}${action}/${req.params.id}/delete`;
    }

    inferredAction = req.params.id
      ? action.replace(`/services/${req.params.id}`, "")
      : action.replace(`/services`, "");
  }
*/

  // //console.log("Action:", action);
  // const uid = req.user.id;
  // const orgid = req.user.orgId;

  // // Get User Assignments
  // const userAssignments = await getUserAssignments({ id: uid, orgId: orgid });
  // //console.log(`User Assignments: ${userAssignments}`);

  // // Get User Actions
  // const userActions = await Promise.all(
  //   userAssignments.map(async (assignment) =>
  //     getInternalRoleActions(assignment.role, assignment.scope, orgid)
  //   )
  // );
  // //console.log(userActions);

  // // Get Team Assignments
  // const teamAssignments = await getTeamAssignments();
  // //console.log(teamAssignments);

  // // Filter the Teams to those that the User is a member of
  // const filteredTeams = teamAssignments.filter(
  //   (assignment) => {
  //     return req.user.teams.includes(assignment.principal);
  //   } //&& assignment
  // );
  // //console.log(`Team Assignments: ${filteredTeams}`);

  // // Get Team Actions
  // const filteredRoles = await Promise.all(
  //   filteredTeams.map(async (assignment) =>
  //     getInternalRoleActions(assignment.role, assignment.scope, orgid)
  //   )
  // );
  // //console.log("Team Actions:", filteredRoles);

  // // Merge Actions
  // const allActions = [...userActions, ...filteredRoles];

  // const allowedActions = allActions.flat();
  // // const newAllowedActions = allowedActions.map((action) =>
  // //   action != "*" ? `/orgs/${req.user.orgId}${action}` : "*"
  // // );
  // //console.log(actions);

  console.log("Requested Action:", action);
  console.log("Inferred Allowed Action:", inferredAction);
  console.log("Actions Allowed:", req.user.allowedActions);

  // Check Requesed Action is in list of allowed Actions
  const authorised =
    req.user.allowedActions.includes("/*") ||
    req.user.allowedActions.includes(action) ||
    req.user.allowedActions.includes(inferredAction)
      ? true
      : false;

  // Restrict Org Read to same org unless /orgs/read is present
  // if (!allowedActions.includes("/orgs/read")) {
  //   req.params.id = req.user.orgId;
  // }

  if (authorised) {
    console.log(`Authorisation Successful for ${req.user.name} at ${action}`);
    next();
  } else {
    console.log("Not Authorised");
    // res.status(401);
    res.send(`You are not authorised for action: ${action}`);
    //throw new Error(`You are not authorised for action: ${action}`);
  }
  console.timeEnd("AuthZ");
});

export { authz };
