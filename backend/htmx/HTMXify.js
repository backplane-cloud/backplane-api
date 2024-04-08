// HTMX functions using Web Components

function listResources(resources, fields, title, type, showbreadcrumb) {
  let html = `
  <div>`;

  showbreadcrumb &&
    (html += `<bread-crumb breadcrumbs="${type}"></bread-crumb>`);

  html += `
  
  
  <div class="flex justify-between content-center">
    <div class="content-center ml-5">
    <search-box type="${type}" title="${title}" size="w-96"></search-box>
    </div>
    <div>
    <create-button type="${type}"></create-button>
    </div>
  </div>
    <list-view resources='${JSON.stringify(
      resources
    )}' fields="${fields}" type='${type}'><list-view>
    
  </div>`;

  return html;
}

function showResource(resource, tabs, breadcrumbs) {
  let resourceType = resource.type + "s";
  let resourceDisplay =
    resourceType.charAt(0).toUpperCase() + resource.type.slice(1);
  let html = `
  
    <div>
      <bread-crumb breadcrumbs='${breadcrumbs}'></bread-crumb>
    </div>
    <div>
      <h1 class="mb-5 text-2xl font-bold tracking-tight text-gray-900">
      ${resource.name}
        </h1>
    </div>
    <div class="mb-5">
      <nav-bar menu='${tabs}' type="${resource.type}" resourceId="${resource.id}" target='resource-content'></nav-bar>
    </div>
  

  <div id='resource-content' class=''></div>
    
  
    `;

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

// Registration of New User and Org
function registerHTMX() {
  console.log("returning registerHTMX");
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
  
><img src='img/backplane-logo-text.png' class='mx-auto'/>

<h1 class='text-3xl mb-10'>Register</h1>
 
  <div class="mb-5">
    <label
      for="name"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Name</label
    >
    <input
      type="text"
      id="name"
      name="name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder=""
      required
    />
  </div>
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
    for="orgName"
    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >Organisation name</label
  >
  <input
    type="text"
    id="orgName"
    name="orgName"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder=""
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
  <div class="mb-5">
    <label
      for="confirm-password"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Confirm password</label
    >
    <input
      type="password"
      name="confirm-password"
      id="confirm-password"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>
  

  <button
    hx-post="/api/users/register"
    hx-headers='{"ui": true, "action": "register"}'
    hx-swap="outerHTML"
  hx-target="#loginSection"
  
  hx-headers='{"ui": true}'
    type="submit"
    class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"
  >
    Register
  </button>


  
  <button hx-target="#datapane" hx-get="api/users/check-auth" hx-headers='{"ui": true}' hx-swap="outerHTML">Cancel</button>
  
</form>
</div>`;

  return HTML;
}

function resourceOverviewTab(resource, fields, action) {
  let edit = action === "edit" && true;
  console.log("edit", edit);

  let HTML;

  HTML = `
  <form class="space-y-6" action="#"> 
  <button class="m-3 opacity-50 cursor-not-allowed text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Link to Product</button>
  `;

  edit
    ? (HTML += `<button hx-put='/api/${resource.type}s/${resource.id}' hx-target='#resource-content' hx-headers='{"ui": true}' class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
    <button hx-get='/api/${resource.type}s/${resource.id}/overview' hx-target='#resource-content' hx-headers='{"ui": true, "action": "cancel"}' class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
    <button hx-confirm="Are you sure?" hx-delete="/api/${resource.type}s/${resource.id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "delete"}'class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>    
    <button hx-confirm="Are you sure?" hx-put="/api/${resource.type}s/${resource.id}/disable" hx-target="#display-content" hx-headers='{"ui": true, "action": "disable"}'class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Disable</button>    `)
    : (HTML += `<button hx-get='/api/${resource.type}s/${resource.id}/overview' hx-target='#resource-content' hx-headers='{"ui": true, "action": "edit"}' class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
    
    `);

  HTML += `
  <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  fields.map((field) => {
    let value;
    if (field === "cloud") {
      value = `<img src='img/${resource[field]}.png' />`;
    } else {
      value = edit
        ? `<input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='${field}' id='${field}' value='${
            resource[field] === undefined ? "" : resource[field]
          }' />`
        : resource[field];
    }

    HTML += `</form>
            <div class="p-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="ml-5 text-sm font-medium leading-6 text-gray-900">${field}</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${value}</dd>
          </div>`;
  });

  HTML += "</div>";

  return HTML;
}

export {
  listResources,
  showResource,
  viewHTMXify,
  registerHTMX,
  resourceOverviewTab,
};
