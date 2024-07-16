// HTMX functions using Web Components

function listResources(resources, fields, title, type, showbreadcrumb) {
  let html = `
  <div>`;

  showbreadcrumb &&
    (html += `<bread-crumb breadcrumbs="${type}"></bread-crumb>`);

  html += `
  
  <div>
  <h1 class="mb-5 text-2xl font-bold tracking-tight text-gray-900">
  ${title}
    </h1>
</div>
  <div class="flex justify-between content-center">
    <div class="content-center ml-5">
    <search-box type="${type}" title="${title}" size="w-96"></search-box>
    </div>
    <div>
      <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="my_modal_1.showModal()"  hx-get="/api/${type}/create" hx-target="#my_modal" hx-headers='{"ui": true, "action": "create"}'>Create ${type.slice(
    0,
    type.length - 1
  )}</button>
      <dialog id="my_modal_1" class="modal">    
        <div class="modal-box w-4/12 max-w-5xl" id="my_modal"></div>
      </dialog>
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
      ${resource.name || resource.type}
        </h1>
    </div>
    
    <div class="mb-5">
      <tab-bar menu='${tabs}' type="${resource.type}" resourceId="${
    resource.id
  }" target='resource-content'></tab-bar>
    </div>
  

  <div id='resource-content' class=''></div>
    
  
    `;

  return html;
}

function createResource(
  jsonObject,
  fields,
  title,
  type,
  action,
  orgId,
  returnpath
) {
  console.log("returnpath", returnpath);
  let html = `
      <div class="">
        <form class="space-y-6" action="#">
          <h5 class="text-3xl font-medium text-gray-900 dark:text-white">${
            jsonObject.name || title
          }</h5>
          <div>`;

  fields.map((field) => {
    if (
      field === "cloud" ||
      field === "appTemplate" ||
      field === "platformId"
    ) {
      if (field === "cloud") {
        html += `
          <div class="m-5 ">
            <select-picker collection='${jsonObject.cloud.collection}' label='${jsonObject.cloud.label}' field='cloud'></select-picker>
            
          </div>`;
      }

      if (field === "appTemplate") {
        html += `
          <div class="m-5 ">
            <select-picker collection='${jsonObject.appTemplate.collection}' label='${jsonObject.appTemplate.label}' field='template'></select-picker>
          </div>
                  `;
      }

      if (field === "platformId") {
        html += `<div class="m-5"><select-picker collection='${jsonObject.platforms.collection}' label='${jsonObject.platforms.label}' field='platformId'></select-picker></div>`;
      }
    } else {
      html += `<div class="m-5">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${field}</label>
                                <input value='${
                                  jsonObject[field] === undefined
                                    ? ""
                                    : jsonObject[field]
                                }' name="${field}" id="${field}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" ${
        action !== "edit" && action !== "create" && "disabled"
      } ${field === "id" && "readonly"}/>
                              </div>`;
    }
  });

  html += `</div>`;

  if (action === "edit") {
    html += `<button type="submit" class="m-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" hx-put="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Save</button>`;
    html += `<button type="submit" class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" hx-confirm="Are you sure?" hx-delete="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Delete</button>`;
    html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/${jsonObject.id}" hx-target="#display-content" hx-headers='{"ui": true}'>Cancel</button>`;
  } else if (action === "create") {
    if (title === "Create Budget") {
      html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-post="/api/${type}/${orgId}/budgets/create" hx-target="#display-content" hx-headers='{"ui": true}'>Create</button>`;
    } else {
      html += `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-post="/api/${type}" hx-target="#display-content" hx-headers='{"ui": true, "returnpath": "setup"}'>Create</button>`;
    }
    if (returnpath) {
      html += `<button class="btn" hx-get="/api/orgs/${orgId}/setup" hx-target='#display-content' hx-headers='{"ui": true}'>Close</button>`;
    } else {
      html += `<button class="btn" hx-get="/api/${type}" hx-target='#display-content' hx-headers='{"ui": true}'>Close</button>`;
    }
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

<form class="max-w-sm mx-auto" id="loginForm">

<h1 class='text-3xl mb-10'>Register New Organisation and User</h1>
 
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
    class="w-32 mr-10 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"
  >
    Register
  </button>


  
  <button hx-target="#datapane" hx-get="api/users/check-auth" hx-headers='{"ui": true}' hx-swap="outerHTML">Cancel</button>
  
</form>
</div>`;

  return HTML;
}

export { listResources, showResource, createResource, registerHTMX };
