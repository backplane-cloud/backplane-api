# Requests

Contents

1. Overview
2. API Details
3. Examples

### Overview

Backplane Workflow Approval Engine uses Requests entity.

Typical use-cases are budget approval and linking an App to a Product, which has budget implications.

A request can be raised at any scope (i.e. Org, Platform, Product and App). The approvers will receive an e-mail notification for approval, upon which an e-mail link to approve or reject is in the e-mail body.

Each scope will have an Approval Team which will have at least one member (Scope Owner by default).

## API details

The `/requests` endpoint allows for requests to be raised for certain business process activities. For example, a Product requesting budget approval from its parent Platform, or a Platform requesting budget approval from its parent Org.

`GET, POST /requests`

`GET, PUT, DELETE /requests/:id`

`GET /requests/:id/approve?approvalCode=12345`

> Note: The approval link is not authenticated or subject to authorisation middleware, the approval code validates that the person clicking the link is the recipient of the e-mail.

##### Overview

Backplane provides approval requests for events such as linking an App to a Product or requesting budget approval for a Product from a Platform, or Platform from an Org.

The `/request` endpoint allows approval requests to be created, upon which, e-mail notifications are sent to the respective approval authority with a link they can click on to either approve or reject the request.

## Examples:

#### Linking App to Product

`bp request add --type link --requestForType product --requestForId <id> --appid <appid>`

```
Request {
    _id:
    requestType: link | budget,
    requestForType: platform | product,
    requestForId: <id>,
    orgId: <orgId>,
    requester: <userID>,

}
```

#### Requesting Budget for a Product

```
bp request add --requestType budget --requestedForType product --requestedForId <ProductId> --budget 100,000
```

#### Requesting Budget for a Platform

```
bp request add --requestType budget --requestedForType platform --requestedForId <PlatformId> --budget 100,000
```

> Note: Before a Product can request a Budget, the parent platform must already have a budget allocated. The same is true for a Platform requesting a budget from the Org, the Org budget needs to be set.
