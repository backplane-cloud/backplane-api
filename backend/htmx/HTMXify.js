function HTMXify(jsonObject, fields, title, type) {
  let html = `<div id="dataplane">
      <h1 class='text-2xl mb-10'>${title}</h1>
     <button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/create" hx-target="#datapane" hx-headers='{"ui": true, "action": "create"}'>Create ${title.substring(
    0,
    title.length - 1
  )}</button>

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"><tr>`; // Start with a table
  html +=
    '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr>'; // Start a table row for header
  fields.map((field) => {
    html += '<th scope="col" class="px-6 py-3">' + field + "</th>"; // Key as table header
  });

  html += "</tr></thead>"; // Close the table header row
  if (jsonObject.length === undefined) {
    jsonObject = [jsonObject];
  }
  if (jsonObject.length !== 0) {
    // Create table rows for values

    jsonObject.map((entity) => {
      html += '<tr scope="col" class="px-6 py-3">';
      fields.map((field, i) => {
        let value = entity[field] === undefined ? "Not Set" : entity[field];

        let meta =
          i === 0
            ? ` class="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" hx-get="/api/${type}/${entity.id}" hx-target="#datapane" hx-headers='{"ui": true, "action": "view"}'`
            : `class="px-6 py-4"`;
        let clouds = ["azure", "gcp", "aws"];
        if (clouds.includes(value)) {
          value = `<img src='img/${value}.png'/>`;
        }

        switch (field) {
          case "orgId":
            html += `<td class='text-blue-500'><a href='#' hx-get="/api/orgs/${value}" hx-target="#datapane" hx-headers='{"ui": true}'>${value}</a></td>`;
            break;
          case "ownerId":
            html += `<td class='text-blue-500'><a href='#' hx-get="/api/users/${value}" hx-target="#datapane" hx-headers='{"ui": true}'>${value}</a></td>`;
            break;
          default:
            html += `<td ${meta}>${value}</td>`; // Value cell
        }
      });
      html += "</tr>"; // Close the value row
    });
  } else {
    html += `<tr><td colspan='${fields.length}'><h2 class='mt-10'>No ${title} Found</h2></td></tr>`;
  }

  html += "</table></div>"; // Close the table
  return html;
}

function viewHTMXify(jsonObject, fields, title, type, action) {
  console.log("action", action);
  let html = `
      <div class="mx-auto max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" action="#">
          <h5 class="text-3xl font-medium text-gray-900 dark:text-white">${
            jsonObject.name || title
          }</h5>
          <div>`;

  fields.map((field) => {
    // if (Array.isArray(jsonObject[field])) {
    //   html += `<div class="m-5 ">
    //                             <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${field}</label>
    //                             <textarea name="${field}" id="${field}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com">
    //                             ${jsonObject[field]}
    //                             </textarea>
    //                           </div>`;
    // } else {
    html += `<div class="m-5 ">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${field}</label>
                                <input value='${
                                  jsonObject[field] === undefined
                                    ? ""
                                    : jsonObject[field]
                                }' name="${field}" id="${field}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required ${
      action !== "edit" && action !== "create" && "disabled"
    } ${field === "id" && "readonly"}/>
                              </div>`;
    // }
  });

  html += `</div>`;

  if (action === "edit") {
    html += `<button type="submit" class="m-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" hx-put="/api/${type}/${jsonObject.id}" hx-target="#datapane" hx-headers='{"ui": true}'>Save</button>`;
    html += `<button type="submit" class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" hx-confirm="Are you sure?" hx-delete="/api/${type}/${jsonObject.id}" hx-target="#datapane" hx-headers='{"ui": true}'>Delete</button>`;
    html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/${jsonObject.id}" hx-target="#datapane" hx-headers='{"ui": true}'>Cancel</button>`;
  } else if (action === "create") {
    html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-post="/api/${type}" hx-target="#datapane" hx-headers='{"ui": true}'>Create</button>`;
  } else {
    html += `<button type="submit" class="m-3 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" hx-get="/api/${type}/${jsonObject.id}" hx-target="#datapane" hx-headers='{"ui": true, "action": "edit"}'>Edit</button>`;
  }

  html += `</form></div>`;

  return html;
}

function loginHTMX() {
  let HTML = `
<div
id="loginSection"
hx-get="/api/users/check-auth"
hx-trigger="load"
hx-target="#loginSection"
class="mt-0"
>
<form
  class="max-w-sm mx-auto"
  id="loginForm"
  hx-swap="outerHTML"
  hx-target="#loginSection"
  hx-post="/api/users/login"
  hx-headers='{"ui": true}'
>
  <div class="mb-5">
    <label
      for="email"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Your email</label
    >
    <input
      type="email"
      id="email"
      name="email"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="user@backplane.cloud"
      required
    />
  </div>
  <div class="mb-5">
    <label
      for="password"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Your password</label
    >
    <input
      type="password"
      name="password"
      id="password"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>
  <div class="flex items-start mb-5">
    <div class="flex items-center h-5">
      <input
        id="remember"
        type="checkbox"
        value=""
        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
        required
      />
    </div>
    <label
      for="remember"
      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >Remember me</label
    >
  </div>
  <button
    hx-post="/api/users/login"
    type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Submit
  </button>
</form>
</div>`;

  return HTML;
}

export { loginHTMX, viewHTMXify, HTMXify };