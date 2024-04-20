function orgCloudCredentialsTab(resource, orgId, action, cloud) {
  if (resource === undefined) {
    return `
        <div>
          <h1>No Cloud Credentials set. <button hx-get='/api/orgs/${orgId}/${cloud}' hx-target='#resource-content' hx-headers='{"ui": true, "action": "create"}' class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5 text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Credentials</button></h1>
  
        <div>
        `;
  }
  let HTML = `<form class="space-y-6" action="#">`;
  let edit = action === "edit" && true;

  HTML += `
    
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  
      <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      
      <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  let fields = Object.keys(resource._doc);
  fields.map((field) => {
    let value;

    if (field === "gcpsecret") {
      let gcpSecretObj = resource.gcpsecret;
      let subfields = Object.keys(resource[field]);
      subfields.map((field) => {
        let value = gcpSecretObj[field];
        edit
          ? (HTML += `
            <div class="p-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="ml-5 text-sm font-medium leading-6 text-gray-900">${field}</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='${field}' id='${field}' value='${gcpSecretObj[field]}' /></dd>
            </div>`)
          : (HTML += `
            <div class="p-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="ml-5 text-sm font-medium leading-6 text-gray-900">${field}</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${value}</dd>
            </div>
            `);
      });

      // value = edit
      //   ? `<form enctype="multipart/form-data"><input type="file" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='${field}' id='${field}' /><button type="submit">Upload</button></form>`
      //   : resource[field];
    } else {
      field === "provider"
        ? (value = `<img src='img/${resource[field]}.png' />`)
        : (value = edit
            ? `<input ${
                field === "provider" && "disabled"
              } class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='${field}' id='${field}' value='${
                resource[field] === undefined ? "" : resource[field]
              }' />`
            : resource[field]);
    }

    HTML += `
        <div class="p-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="ml-5 text-sm font-medium leading-6 text-gray-900">${field}</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${value}</dd>
        </div>`;
  });

  edit
    ? (HTML += `<button hx-put='/api/orgs/${orgId}/${resource.provider}' hx-target='#resource-content' hx-headers='{"ui": true, "action": "save"}' class="m-3 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5 text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                 <button hx-get='/api/orgs/${orgId}/${resource.provider}' hx-target='#resource-content' hx-headers='{"ui": true, "action": "cancel"}' class="m-3 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
  
            <button hx-confirm="Are you sure?" hx-delete="/api/orgs/${orgId}/${resource.provider}" hx-target="#resource-content" hx-headers='{"ui": true, "action": "delete"}' class="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                 `)
    : (HTML += `<button hx-get='/api/orgs/${orgId}/${resource.provider}' hx-target='#resource-content' hx-headers='{"ui": true, "action": "edit"}' class="m-5 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded">Edit</button>`);

  HTML += `</form>`;
  return HTML;
}

function orgTab(resource, fields, action) {
  console.log("Resource", resource, fields, action);
  let edit = action === "edit" && true;

  let HTML = `<list-view resources='${JSON.stringify(
    resource
  )}' fields='${fields}' type='templates'></list-view>`;

  return HTML;
}

export { orgCloudCredentialsTab, orgTab };
