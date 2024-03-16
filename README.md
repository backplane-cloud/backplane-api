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

`npm install @backplane-software/backplane`

# Usage

`npm run server`

This will host the REST API on port 8000.

If running locally for development, you'll need a `.env` file with environment variables as below.

```
NODE_ENV=development
PORT=8000
MONGO_URI=<Enter MongoDB URI>
JWT_SECRET=<Enter a Secret>
GOOGLE_APPLICATION_CREDENTIALS=<enter path to JSON file with credentials>
MAILSENDER_USERNAME=<Enter Username>
MAILSENDER_PASSWORD=<Enter Password>
LOG_LEVEL=debug
LOGTAIL_KEY=<Enter Key>
```
