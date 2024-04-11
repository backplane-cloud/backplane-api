export default class ListView extends HTMLElement {
  constructor() {
    super();

    const fields = this.getAttribute("fields").split(",");
    const resources = JSON.parse(this.getAttribute("resources"));
    const type = this.getAttribute("type");

    let HTML = "";

    HTML = `
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tr>
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    `;

    fields.map((field) => {
      HTML += `<th scope="col" class="px-6 py-3">${field}</th>`;
    });

    HTML += "</thead><tr>";
    if (resources.length !== 0) {
      // Create table rows for values

      resources.map((entity) => {
        console.log(entity);
        HTML += '<tr scope="col" class="px-6 py-3">';
        fields.map((field, i) => {
          let value = entity[field] === undefined ? "-" : entity[field];

          // Make first value linkable to resources
          let meta =
            i === 0
              ? `class="cursor-pointer w-6 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" hx-get="/api/${type}/${entity._id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "view"}'`
              : `class="px-6 py-4"`;

          // Display Cloud Image instead of name
          let clouds = ["azure", "gcp", "aws"];
          if (clouds.includes(value)) {
            value = `<img src='img/${value}.png'/>`;
          }

          // Status Badge
          if (field === "status") {
            value = `<div class="badge badge-outline">${entity[field]}</div>`;
          }

          // Cost Processing
          if (field === "cost") {
            if (entity[field]?.length === 0 || entity[field] === undefined) {
              console.log("Detected undefined for cost");
              value = "-";
            } else {
              value = `$ ${entity[field][
                entity[field].length - 1
              ].cost.toLocaleString()}`;
            }
          }
          // Budget Processing
          if (field === "budget") {
            if (entity[field]?.length === 0 || entity[field] === undefined) {
              console.log("Detected undefined for budget");
              value = "-";
            } else {
              let budget = entity[field];
              value = `$ ${budget[budget.length - 1].budget?.toLocaleString()}`;
            }
          }

          // Delta
          if (field === "utilisation") {
            if (
              entity["budget"] === undefined ||
              entity["cost"] === undefined
            ) {
              value = "-";
            } else {
              let budget = parseInt(
                entity["budget"][entity["budget"].length - 1]?.budget
              );
              let cost = entity["cost"][entity["cost"].length - 1]?.cost;
              let utilisation = ((cost / budget) * 100).toFixed(1);
              isNaN(utilisation)
                ? "-"
                : (value = `<progress class="progress w-56" value="${utilisation}" max="100"></progress>`);
              // : (value = `<div class="badge ${
              //     utilisation >= 100 ? "badge-neutral" : "badge-outline"
              //   }">${utilisation} %</div>`);
            }
          }

          // Display Repo image
          if (field === "repo" && entity[field] !== "No Repo") {
            value = `<img src='img/github.png'/>`;
          }

          switch (field) {
            case "orgId":
              HTML += `<td><a href='#' hx-get="/api/orgs/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
              break;

            case "ownerEmail":
              HTML += `<td><a href='#' hx-get="/api/users/${entity["ownerId"]}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
              break;
            default:
              HTML += `<td ${meta}>${value}</td>`; // Value cell
          }
        });
        HTML += `</tr>`; // Close the value row
      });
    } else {
      HTML += `<tr><td colspan='${fields.length}'><h2 class='mt-10'>No ${title} Found</h2></td></tr>`;
    }
    HTML += "</table></div>";

    this.innerHTML = HTML;
  }
}

window.customElements.define("list-view", ListView);
