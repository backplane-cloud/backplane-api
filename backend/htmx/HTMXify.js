function HTMXify(jsonObject, fields, title, type) {
  let html = `<div>
      <h1 class='text-2xl mb-10'>${title}</h1>
     <button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/create" hx-target="#display-content" hx-headers='{"ui": true, "action": "create"}'>Create ${title.substring(
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
            ? ` class="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" hx-get="/api/${type}/${entity.id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "view"}'`
            : `class="px-6 py-4"`;
        let clouds = ["azure", "gcp", "aws"];
        if (clouds.includes(value)) {
          value = `<img src='img/${value}.png'/>`;
        }

        switch (field) {
          case "orgId":
            html += `<td class='text-blue-500'><a href='#' hx-get="/api/orgs/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
            break;
          case "ownerId":
            html += `<td class='text-blue-500'><a href='#' hx-get="/api/users/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
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
    html += `<button type="submit" class="m-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" hx-put="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Save</button>`;
    html += `<button type="submit" class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" hx-confirm="Are you sure?" hx-delete="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Delete</button>`;
    html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Cancel</button>`;
  } else if (action === "create") {
    html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-post="/api/${type}" hx-target="#display-content" hx-headers='{"ui": true}'>Create</button>`;
  } else {
    html += `<button type="submit" class="m-3 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" hx-get="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "edit"}'>Edit</button>`;
  }

  html += `</form></div>`;

  return html;
}

function loginHTMX(message) {
  let HTML = `

<div
id="loginSection"
hx-get="/api/users/check-auth"
hx-target="#loginSection"
class="mt-0"
>

<form
  class="max-w-sm mx-auto"
  id="loginForm"
  
><img src='img/backplane-logo.png' class='mx-auto'/>
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
    hx-swap="outerHTML"
  hx-target="#loginSection"
  hx-post="/api/users/login"
  hx-headers='{"ui": true}'
    type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Submit
  </button>
  <div class="text-red">${message.message}</div>
</form>
</div>`;

  return HTML;
}

function appView(jsonObject, fields, title, type, action) {
  let HTML = ` <div>
  <div class="px-4 sm:px-0 flex w-full justify-between">
    <div>
    <h3 class="text-base font-semibold leading-7 text-gray-900 text-4xl"> ${title}</h3>
    <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500"></p>
    </div>
    <div><img src='img/${jsonObject.cloud}.png' /></div>
  </div>
  <div class="mt-6 border-t border-gray-100">
    <dl class="divide-y divide-gray-100">`;

  fields.map((field) => {
    let value;
    if (field === "cloud") {
      value = `<img src='img/${jsonObject[field]}.png' />`;
    } else {
      value = jsonObject[field];
    }

    HTML += `
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">${field}</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${value}</dd>
        </div>`;
  });

  HTML += `<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Environments</dt>
        
        
        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">

          `;

  jsonObject.environments.map((env) => {
    HTML += `<li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
            <div class="flex w-0 flex-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
          
          
              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                <span class="truncate font-medium">${env.name}</span>
                <span class="flex-shrink-0 text-gray-400">$1,000</span>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Deployments</a>
            </div>
          </li>`;
  });

  HTML += `
          </ul>
        </dd>




      </div>
    </dl>
  </div>
</div>
`;
  return HTML;
}
export { appView, loginHTMX, viewHTMXify, HTMXify };
