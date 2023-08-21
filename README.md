# Backplane 

Backplane is an open source cloud abstraction API.   

The vision for Backplane is to build an abstracted Cloud API to remove the development complexity with interfacing with multiple public cloud providers. 

By having a single, generic and cloud agnostic endpoint, cost, access and policy data can be easily retrieved and cloud environments easily provisioned. 

API calls to cloud service providers can be sent to Backplane Core instead, removing integration and maintenance. Example use cases include Internal Development Platforms, Cloud Management platforms or any toolset that needs to interface with multiple cloud providers. 

The heart of Backplane core is about cloud governance, cost governance, access management and cloud controls. 

Key functionality: 

  - Provision Cloud Environments
  - Retrieving Cost Data
  - Retrieving Policy Data
  - Retrieving Access Data

Backplane Core is licensed under Apache 2.0 and donated to the Cloud Native Compute Foundation.



## Backplane Extensions

Backplane X is a marketplane for custom extensions that extends Backplane's functionality, these can be open source and free, or under paid-for licenses. Third party and first party extensions will be available in the backplane marketplace host at x.backplane.cloud. 

[Backplane Cloud](https://) is a hosted and managed SaaS offering provided by Backplane Software Ltd, this is provided under a subscription model which offers convenience for smaller organisations. 

[Backplane Core](https://) is the open source engine upon which you can build your cloud management, development and governance platforms. 


## Architecture

Backplane is developed using the MERN stack of MongoDB, Express, React and Node. 

The API Server exposes REST Endpoints and it conforms to a microservices architecture. 

## Data Model

The data hierarchy starts with an `Organisation`, which contains many `platforms`, which contains many `products`, and each product can contain many `apps`, although typically it'll be a one-to-one relationship as the App workload will invariably represent the Product. 

Apps are the actual cloud workload can can reside in any cloud service provider and linked to a single Product, this is to cater for multicloud-based Products. 


## REST API Endpoints
| endpoint | Description |
| --- | ----------- |
| `/orgs` | This is the highest management scope and represents your Organisation. |
| `/platforms` | Org's will comprise of several platforms that represent business units and/or capabilities |
| `/products` | A Product is the business representation of a cloud workload and subject to business process workflow |
| `/apps` | An App is the actual workload hosted on a cloud platform. An App will have a Prod, Non Prod, Test and Dev environments provisioned |
| `/requests` | Requests are raised for scenarios such as linking an App to a Product or requesting Platform or Product budget  |
| `/services` | Services can be added to Backplane, for example a service called 'Github' is used to provision Repos up App creation. |
| `/users` | Users belong to a single Org.  |
| `/teams` | Teams are a set of Users, and role based access assignments can be granted to a Team as opposed to individial Users |
| `/roles` | Roles are a set of allowed actions and these are used in the Authorisation middleware to provide fine grained access controls |
| `/assignments` | A security principal such as a User or Team can be Assigned a Role at the scope of Org, Platform, Product or App |
| `/auth` | This is used for Authentication, whereby a JWT will be issued as a HTTP-only cookie if client is a web browser |

Please refer to the technical documentation for more details. 


# Getting Started

To get started, download and install the [Backplane CLI](https://cli.backplane.cloud)

The entry point to Backplane is registering your first user `/api/users/register`. This kicks off a set of activities: 

### Registering
- Creates a `User`
- Creates an `Org`
- Creates `Roles` and the initial `Assignment`

```
bp user add --email lewis@backplane.cloud --password 12345 --orgname 'Backplane Software'
```

With the Organisation created, the User will be assigned the role of **Org Administrator** which permits the allow actions of `/write, /delete` at `/orgs/:id` scope. 


> [!NOTE]
> The first user in an Organisation will have the role of Org Administrator.

The next step will be to create some platforms for your organisation. 

### Creating a Platform

`bp platform add --displayname 'Platform A'`

You can repeat this process and create as many Platforms as necessary that best represents your organisation. The Platform scope is both an organisational container as well as a management scope. We'll explain more about that shortly. 

With your first Platform created, you can then proceed to create a Product. 

> [!IMPORTANT]
> When creating any resources in Backplane, the Owner of the resource is set to the logged in User.


### Creating a Product

`bp product add --displayname 'My Product' --platformid <id of platform> --Description 'This is my first Product'`

> [!NOTE]
> Use `bp platform list` to obtain the platform ID`


### Setting a Budget

With the Org, Platform and Product created, the next port of call will be to set your Organisation budget. 


`bp org update --id <orgID> --budgetAmount 50000 --budgetYear 2023 --budgetCurrency USD`

With the Org budget set, the platform will need to be allocated a portion of the budget. This is done by raising a request for budget. 

`bp request add --requestType budget --requestedForType platform --requestedForId <platformId>`

This sends an e-mail to the Org Owner (to be Approval Team), the e-mail contains a link to either accept or reject. Once the request is accepted, the platform budget is updated and the Org allocation is adjusted accordinging. 

Once the platform budget has been set, the same process needs to happen with the Product. 

`bp request add --requestType budget --requestedForType product --requestedForID <productId>`

This time the Platform Owner (default approval authority) will receive an e-mail as per the process above. Once approved, the platform `allocatedBudget` field is updated. 


Now, before we can begin creating Cloud Apps, we must first register a Cloud Provider to our Organisation. 

> [!WARNING]
> A service principal will need to be created with Owner Privilege in your Cloud Provider.

### Adding Cloud Service Provider

### Creating your first App

With the above all in place, we're now ready to create our first cloud app. This is simple:

`bp app add --displayname 'My App' --cloud azure`

Yes - it's as simple as that. This will make the necessary call to your CSP to provision the environments, share credentials, add the necessary access etc. In addition, a Repo will be created in Github (configure Repo and CSP doc). 


Apps are allowed to be created immediately, this is part of the self-service developer experience. The App cannot be deployed into Product until it has been linked to a Product which will have a budget allocated. By decoupling business process and cloud provisioning, it enables for a developer experience that aligns with being agile and getting to value quickly. In the unlikely scenario the App is not approved to be linked to a Product, the resources are deleted and the App is removed. 

> [!NOTE]
> A product can contain multiple Apps. Apps are the cloud workload, and will contain environments and a repository.


Congratulations, you have setup Backplane, configured your Org, Platform and created a Product and created an App. 

To link an app to a Product:

`bp request add --requestType link --requestedForType product --requestedForId <productId>`

And once approved, the `productId` of the App becomes the actual Product it is linked to, and the Product keeps an array of linked Apps. 

You can now run `bp org show --id <orgId> --tree` to see a visual hierarchy on the terminal. The CLI walkthrough in this getting started represents a new setup. Apps can be created quickly and easily, with the segregated concerns of account provisioning, resource provider registering, access implementation being left to Backplane API. 


