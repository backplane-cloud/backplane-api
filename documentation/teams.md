# Teams

Contents

1. Overview
2. API Details
3. Examples

### Overview

Teams are a set of User IDs and are used in RBAC assignments.

Teams can be scoped to an Org, Platform, Product or App. Whereas a User is scoped to the Org only, and then assignments are granted at the hierarchy level required.

Org Teams permissions will take effect across the whole orgnanisation.

Platform Team permissions will only be effective at the Platform level and lower.

Product Team permissions will only be effective at the Product team and lower.

App Team permissions will only be available at the App level.

Teams provide a useful way to provide a number of users access in Backplane.

When a Product is created a Team for each environment is also created.

## API details

The `/teams`

`GET, POST /teams`

`GET, PUT, DELETE /teams/:id`

```
{
  _id: '64d2b675b375ed490185b18e',
  name: 'Peanuts App Team',
  code: 'peanuts',
  orgId: '649960a3f696f0c379649ee2',
  members: [],
  owners: [],
  scope: '/orgs/649960a3f696f0c379649ee2/orgs/649960a3f696f0c379649ee2/platforms/64b71d94d8dae30b55df95e3/products/64b72ba931798d343d11a77a',
  createdAt: '2023-08-08T21:41:09.636Z',
  updatedAt: '2023-08-08T21:41:09.636Z',
  __v: 0
}
```

## Examples using CLI:

#### Creating Team

`bp request add --type link --requestForType product --requestForId <id> --appid <appid>`

```
{
  _id: '64d2b675b375ed490185b18e',
  name: 'Peanuts App Team',
  code: 'peanuts',
  orgId: '649960a3f696f0c379649ee2',
  members: [],
  owners: [],
  scope: '/orgs/649960a3f696f0c379649ee2/orgs/649960a3f696f0c379649ee2/platforms/64b71d94d8dae30b55df95e3/products/64b72ba931798d343d11a77a',
  createdAt: '2023-08-08T21:41:09.636Z',
  updatedAt: '2023-08-08T21:41:09.636Z',
  __v: 0
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
