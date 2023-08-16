# Getting Started

Backplane's datamodel is based on the hierarchy of an Org contains many Platforms, contains many Products which will be linked to one or many Apps. The Apps are the lowest denominator and represent the workload.

Apps can be created immediately by developers, foregoing any formal approvals that will slow down provisioning cloud environments.

Linking the App to a Product is subject to Product approval.

## Logging in

#### Using CLI

`bp auth login --email lewis@backplane.cloud --password *****`

```
{
  _id: '6494e919214b77abb15476e2',
  name: 'Lewis Sheridan',
  email: 'lewis@backplane.cloud',
  orgId: '649960a3f696f0c379649ee2',
  userType: 'root',
  allowedActions: [ '/*' ],
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk0ZTkxOTIxNGI3N2FiYjE1NDc2ZTIiLCJpYXQiOjE2OTIxODMxNDcsImV4cCI6MTY5NDc3NTE0N30.G10zYO-1-2a_xlVf2E_en-NJ8BK51Mgjdfdx-MIFRwI'
}
```

### Creating an Org

`bp org add --displayname 'Backplane Software' --license free`

```
{
  code: 'backplane-software',
  name: 'Backplane Software',
  type: 'org',
  status: 'active',
  license: 'free',
  ownerId: '6494e919214b77abb15476e2',
  csp: [ { provider: 'aws' }, { provider: 'azure' } ],
  budget: [ { year: '2023', budget: 0, budgetAllocated: 0, currency: 'USD' } ],
  appType: [
    {
      name: 'default',
      description: 'Default App Type',
      services: [Array]
    }
  ],
  _id: '64dcb2090791245c27ee3363',
  createdAt: '2023-08-16T11:24:57.118Z',
  updatedAt: '2023-08-16T11:24:57.118Z',
  __v: 0
}
```
