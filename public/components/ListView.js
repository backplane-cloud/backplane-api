export default class ListView extends HTMLElement {
  constructor() {
    super();

    const fields = this.getAttribute("fields").split(",");
    // console.log("fields:", fields);

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
        HTML += '<tr scope="col" class="px-6 py-3">';
        fields.map((field, i) => {
          let value = entity[field] === undefined ? "Not Set" : entity[field];

          // Make first value linkable to resources
          let meta =
            i === 0
              ? `class="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" hx-get="/api/${type}/${entity._id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "view"}'`
              : `class="px-6 py-4"`;

          // Display Cloud Image instead of name
          let clouds = ["azure", "gcp", "aws"];
          if (clouds.includes(value)) {
            value = `<img src='img/${value}.png'/>`;
          }

          // Display Repo image
          if (field === "repo" && entity[field] !== "No Repo") {
            value = `<img src='img/github.png'/>`;
          }

          switch (field) {
            case "orgId":
              HTML += `<td class='text-blue-500'><a href='#' hx-get="/api/orgs/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
              break;
            case "ownerId":
              HTML += `<td class='text-blue-500'><a href='#' hx-get="/api/users/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
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