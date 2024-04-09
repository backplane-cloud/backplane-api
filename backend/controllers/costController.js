import { getApps, getAppCost, updateApp } from "./appController.js";

export default async function syncAppCost() {
  console.time("Running Sync App Cost");
  let apps;

  try {
    apps = await getApps({ user: { userType: "root" }, sync: true });

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
          currentCostHistory[currentCostHistory.length - 1]?.cost;

        getLastCost
          ? currentCostHistory.push({ cost: getLastCost + parseInt(newCost) })
          : currentCostHistory.push({ cost: parseInt(newCost) });

        console.log({ cost: currentCostHistory });

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

  //   try {
  //     apps[0].map(async (app) => {
  //       let cost = await getAppCost({
  //         params: { id: app.id },
  //         body: { orgId: app.orgId },
  //       });
  //       console.log(`${app.name} : ${cost}`);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching apps:", error);
  //     throw error; // Re-throw the error to be caught by the caller
  //   }

  console.timeEnd("Running Sync App Cost");
}

//   console.log("Retrieving Apps");
//   const apps = App.find();
//   apps.map((app) => {
//     let liveCost = getAppCost({ id: app.id });
//     console.log(`${app.code} -> ${liveCost}`);
// let costHistory = app.cost
// costHistory.push(liveCost)
// let updateApp = {
//     ...app,
//     cost: costHistory
// }
// App.findByIdAndUpdate(id, updateApp, {
//     new: true,
// });
//   });
//   console.log(apps);

// const getApps = asyncHandler(async (req, res) => {
//     const apps = await App.find(
//       req.user.userType != "root" ? { orgId: req.user.orgId } : null
//     );

//     if (apps) {
//       if (req.headers.ui) {
//         let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
//         let HTML = listResources(apps, fields, "Apps", "Apps", showbreadcrumb);
//         res.send(HTML);
//       } else {
//         res.status(200).json(apps);
//       }
//     } else {
//       res.status(400);
//       throw new Error("No Apps Found");
//     }
//   });
