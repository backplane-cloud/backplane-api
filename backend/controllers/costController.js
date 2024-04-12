import { getApps, getAppCost, updateApp } from "./appController.js";
import {
  updateProduct,
  getProducts,
  getProductCost,
} from "./productController.js";
import {
  updatePlatform,
  getPlatforms,
  getPlatformCost,
} from "./platformController.js";

import { getOrgCost, updateOrg } from "./orgController.js";

export async function syncAppCost() {
  console.time("Running Sync App Cost");
  let apps;

  try {
    apps = await getApps({
      user: { userType: "root" },
      sync: true,
    });

    let filteredApps = apps; //.slice(0, 25); //.filter((app) => app.cloud !== "gcp"); //apps.slice(0, 15);

    await Promise.all(
      filteredApps.map(async (app) => {
        // Get Current Live Cost
        let newCost = await getAppCost({
          params: { id: app.id },
          body: { orgId: app.orgId },
          sync: true,
        });
        console.log(`App: ${app.name} Cloud: ${app.cloud} Cost: ${newCost}`);

        // Add Cost to App
        let currentCostHistory = app.cost; // retrieve the current cost array

        let getLastCost =
          currentCostHistory[currentCostHistory.length - 1].cost;

        getLastCost
          ? currentCostHistory.push({ cost: getLastCost + parseInt(newCost) })
          : currentCostHistory.push({ cost: parseInt(newCost) });

        // console.log({ cost: currentCostHistory });

        // // Update App wiht new Cost
        await updateApp({
          body: { cost: currentCostHistory },
          params: { id: app.id },
          sync: true,
        });
      })
    );
  } catch (error) {
    console.error("Error fetching apps:", error);
    throw error; // Re-throw the error to be caught by the caller
  }

  console.log(apps.length + " Apps processed");
  console.timeEnd("Running Sync App Cost");
}

export async function propagateAppCostToProduct() {
  console.time("Running Propagate Cost to Product");
  let apps;

  try {
    // Get all Apps
    apps = await getApps({ user: { userType: "root" }, sync: true });
    // console.log(apps.length + " Apps for processing");

    // Filter the Apps to only those with a parent Product
    const appsLinkedToProducts = apps.filter((app) => app.productId);
    appsLinkedToProducts.map((app) => {
      // console.log(app.name + " linked to => " + app.productId);
    });

    // Get Unique Product IDs
    const uniqueProductIds = appsLinkedToProducts.reduce((acc, item) => {
      acc.add(item.productId.toString());
      return acc;
    }, new Set());

    // console.log("unique products", uniqueProductIds);

    let productIds = [...uniqueProductIds];
    // console.log(appsLinkedToProducts);
    // console.log("ids", productIds);
    // return;
    // For each Product, get the App cost for all Apps linked
    await Promise.all(
      productIds.map(async (product) => {
        // Get Apps that match product.id
        let productApps = appsLinkedToProducts.filter(
          (app) => app.productId == product
        );
        // console.log(`${product} has ${productApps.length} Apps linked`);
        // return;
        // Retrieve the Cost and add them to an accumulator acc
        let acc = 0;
        productApps.map(async (app) => {
          // console.log(app.cost);
          let latestCost = app.cost.pop();
          // console.log("latestCost", latestCost);
          acc += latestCost.cost;
        });
        console.log("acc costs is", acc);

        console.log("retreiving cost for:", product);

        // Update Product with new Cost Record
        let costHistory = await getProductCost({
          params: { id: product },
          sync: true,
        });

        let updateCost = costHistory ? costHistory : [{ cost: 0 }]; // Retrieve Existing Cost
        let newCost = { cost: acc };

        // Only Update if value has changed
        if (updateCost[updateCost.length - 1].cost !== acc) {
          costHistory.push(newCost);
          console.log("Updating Product with new Cost", product, newCost);
        } else {
          console.log("No Update Required");
        }

        // console.log("Product:", product);
        // console.log("Old Cost", costHistory);
        // console.log("New Cost", newCost);

        // Update Product with the Accumulated Cost of its Apps
        await updateProduct({
          body: { cost: costHistory },
          params: { id: product },
          sync: true,
        });
      })
    );
  } catch (error) {
    console.error("Error fetching apps:", error);
    throw error; // Re-throw the error to be caught by the caller
  }

  console.timeEnd("Running Propagate Cost to Product");
}

export async function propagateProductCostToPlatform() {
  console.time("Running Propagate Cost to Platform");
  let products;

  try {
    // Get all Products
    products = await getProducts({ user: { userType: "root" }, sync: true });
    console.log(products.length + " Products for processing");

    // Filter the Products to only those with a parent Platform
    const productsLinkedToPlatforms = products.filter(
      (product) => product.platformId
    );
    productsLinkedToPlatforms.map((product) => {
      console.log(product.name + " linked to => " + product.platformId);
    });

    // Get Unique Product IDs
    const uniquePlatformIds = productsLinkedToPlatforms.reduce((acc, item) => {
      acc.add(item.platformId.toString());
      return acc;
    }, new Set());

    console.log("unique platforms", uniquePlatformIds);

    let platformIds = [...uniquePlatformIds];
    console.log(productsLinkedToPlatforms);

    // For each Platform, get the Product cost for all products linked
    await Promise.all(
      platformIds.map(async (platform) => {
        // Get Platforms that match product.id
        let platformProducts = productsLinkedToPlatforms.filter(
          (product) => product.platformId == platform
        );
        console.log(
          `${platform} has ${platformProducts.length} Products linked`
        );

        // Retrieve the Cost and add them to an accumulator acc
        let acc = 0;
        platformProducts.map(async (product) => {
          console.log(product.cost.length);
          let latestCost =
            product.cost.length !== 0 ? product.cost.pop() : { cost: 0 };
          console.log("latestCost", latestCost);
          acc += latestCost.cost;
        });
        console.log("acc costs is", acc);

        // Update Platform with new Cost Record
        let costHistory = await getPlatformCost({
          params: { id: platform },
          sync: true,
        });

        // console.log(costHistory, platform);
        // return;
        let updateCost = costHistory.length !== 0 ? costHistory : [{ cost: 0 }]; // Retrieve Existing Cost

        let newCost = { cost: acc };

        // Only Update if value has changed
        if (updateCost[updateCost.length - 1].cost !== acc) {
          costHistory.push(newCost);
          console.log("Updating Platform with new Cost", platform, newCost);
        } else {
          console.log("No Update Required");
        }

        // console.log("Product:", product);
        // console.log("Old Cost", costHistory);
        // console.log("New Cost", newCost);

        // Update Product with the Accumulated Cost of its Platforms
        await updatePlatform({
          body: { cost: costHistory },
          params: { id: platform },
          sync: true,
        });
      })
    );
  } catch (error) {
    console.error("Error fetching platforms:", error);
    throw error; // Re-throw the error to be caught by the caller
  }

  console.timeEnd("Running Propagate Cost to Platform");
}

export async function propagatePlatformCostToOrg() {
  console.time("Running Propagate Cost to Org");
  let platforms;

  try {
    // Get all Platforms
    platforms = await getPlatforms({ user: { userType: "root" }, sync: true });
    console.log(platforms.length + " Platforms for processing");

    // Filter the Platforms to only those with a parent Org
    const platformsLinkedToOrgs = platforms.filter(
      (platform) => platform.orgId
    );
    platformsLinkedToOrgs.map((platform) => {
      console.log(platform.name + " linked to => " + platform.orgId);
    });

    // Get Unique Org IDs
    const uniqueOrgIds = platformsLinkedToOrgs.reduce((acc, item) => {
      acc.add(item.orgId.toString());
      return acc;
    }, new Set());

    console.log("unique orgs", uniqueOrgIds);

    let orgIds = [...uniqueOrgIds];
    // console.log(platformsLinkedToOrgs);
    // return;

    // For each Org, get the Platform cost for all platforms linked

    await Promise.all(
      orgIds.map(async (org) => {
        // Get Orgs that match platform.id
        let orgPlatforms = platformsLinkedToOrgs.filter(
          (platform) => platform.orgId == org
        );
        console.log(`${org} has ${orgPlatforms.length} Platforms linked`);

        // Retrieve the Cost and add them to an accumulator acc
        let acc = 0;
        orgPlatforms.map(async (platform) => {
          console.log(platform.cost.length);
          let latestCost =
            platform.cost.length !== 0 ? platform.cost.pop() : { cost: 0 };
          console.log("latestCost", latestCost);
          acc += latestCost.cost;
        });
        console.log("acc costs is", acc);

        // Update Org with new Cost Record
        let costHistory = await getOrgCost({
          params: { id: org },
          sync: true,
        });
        // console.log("Cost History", org, costHistory);
        // return;

        let updateCost = costHistory.length !== 0 ? costHistory : [{ cost: 0 }]; // Retrieve Existing Cost
        console.log(updateCost);

        let newCost = { cost: acc };

        // Only Update if value has changed
        if (updateCost[updateCost.length - 1].cost !== acc) {
          costHistory.push(newCost);
          console.log("Updating Org with new Cost", org, newCost);
        } else {
          console.log("No Update Required");
        }

        // console.log("Org:", org);
        // console.log("Old Cost", costHistory);
        // console.log("New Cost", newCost);

        // Update Platform with the Accumulated Cost of its Orgs
        await updateOrg({
          body: { cost: costHistory },
          params: { id: org },
          sync: true,
        });
      })
    );
  } catch (error) {
    console.error("Error fetching platforms:", error);
    throw error; // Re-throw the error to be caught by the caller
  }

  console.timeEnd("Running Propagate Cost to Org");
}
