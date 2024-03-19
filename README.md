# @backplane-software/backplane

This is a RESTful API server that provides a Cloud Abstraction API for the governance concerns of: `Cost`, `Access`, `Resource controls` (aka policies) and `Environment provisioning`.

### Features include:

- Software Catalog listing all Products
- Platform and Product Data model
- View Cloud Cost, Access, Resource controls and Environments through the lens of the Product, Platform or Organisation
- Workflow Approval Engine for Requests
- Full User RBAC
- Budgeting
- CLI

This project is currently MVP-status, and the build represents alpha.

# Installation

`npm install @backplane-software/backplane-api`

# Usage

Refer to Quickstart guide [Backplane.dev - Quick Start](https://backplane.dev/docs/quick-start)

Or this guide:

Install Node and create a project, for example:

```
mkdir backplane-server
cd backplane-server
npm init -y

npm i express
npm i dotenv
npm i @backplane-software/backplane-api
```

Then create an `index.js` file with the below code.

```
import express from "express";
import dotenv from "dotenv";
import backplane from "@backplane-software/backplane";

// Load Environment Configuration
dotenv.config();

// Create Express Instance
const app = express();

// Initialise Backplane Server with Instance
backplane(app);

// Start REST API Server
const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log(`Backplane REST API Server started on port ${port}`)
);
```

Add `"server": "node index.js"` to the `package.json` under the scripts section.

Then `npm run server`.

The following environment variables will be required:

```
NODE_ENV=development
PORT=8000
JWT_SECRET=<provide-key> // Make up your own secret, this is used as the salt to CryptB for password Hashing. e.g. MyS3cureP&!00word*
LOG_LEVEL=debug

MONGO_URI=<provide-key>

MAILSENDER_USERNAME=<provide-username>
MAILSENDER_PASSWORD=<provide-key>

LOGTAIL_KEY=<provide-key>
```
