import asyncHandler from "express-async-handler";

const authz = asyncHandler(async (req, res, next) => {
  console.time("AuthZ");

  console.log("AuthZ Middleware");
  console.log(`IDENTITY: ${req.user.orgId}\\${req.user.name}`);

  let action = req.baseUrl.substring(4, req.baseUrl.length); // e.g. /products
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
