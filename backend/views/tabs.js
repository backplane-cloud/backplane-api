function showCostTab(cost) {
  let HTML;

  HTML = `
  
  <h1>Cost History</h1>
    <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
  
      <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      
      <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Date / Time</th>
                <th scope="col" class="px-6 py-3">Cost</th>
              </tr>
          </thead>
          <tbody>`;

  // Map through the Cost Hsitory
  cost.reverse().map((entry) => {
    let costValue = entry.cost ? "$" + entry.cost.toLocaleString() : "-";
    HTML += `
          <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${entry.createdAt}</td>
            <th scope="row">${costValue}</th>
          </tr>`;
  });

  HTML += `
          
      </tbody>
  </table>
  </div>
  
      `;

  return HTML;
}

function showBudgetTab(budget, orgId) {
  let HTML;

  HTML = `
  
  <h1>Budgets</h1>
    <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
    <button hx-get='/api/orgs/${orgId}/budgets/create' onclick="my_modal_1.showModal()" hx-target="#my_modal" hx-headers='{"ui": true, "action": "create"}' class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-32">Set Budget</button>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box w-4/12 max-w-5xl" id="my_modal"></div>
    </dialog>
      <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      
      <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Year</th>
                <th scope="col" class="px-6 py-3">Budget</th>
                <th scope="col" class="px-6 py-3">Allocated</th>
                <th scope="col" class="px-6 py-3">Available</th>
                <th scope="col" class="px-6 py-3">Currency</th>
              </tr>
          </thead>
          <tbody>`;

  // Map through the Cost History
  budget.reverse().map((entry) => {
    let budgetValue = entry.budget ? "$" + entry.budget.toLocaleString() : "-";
    let budgetAllocated = entry.budgetAllocated
      ? "$" + entry.budgetAllocated.toLocaleString()
      : "-";
    let available =
      "$" +
      (
        parseInt(entry.budget) - parseInt(entry.budgetAllocated)
      ).toLocaleString();
    HTML += `
          <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${entry.year}</td>
            <th class="px-6 py-4" scope="row">${budgetValue}</th>
            <th class="px-6 py-4" scope="row">${budgetAllocated}</th>
            <th class="px-6 py-4" scope="row">${available}</th>
            <th class="px-6 py-4" scope="row">${entry.currency}</th>
          </tr>`;
  });

  HTML += `
          
      </tbody>
  </table>
  </div>
  
      `;

  return HTML;
}

function showRequestTab(requests) {
  let HTML;

  HTML = `
  
  <h1>Requests</h1>
    <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
  
      <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      
      <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
              
                <th scope="col" class="px-6 py-3">requestType</th>
                <th scope="col" class="px-6 py-3">Data</th>
                <th scope="col" class="px-6 py-3">approvalCode</th>
                <th scope="col" class="px-6 py-3">approver</th>
                <th scope="col" class="px-6 py-3">requestedBy</th>
                <th scope="col" class="px-6 py-3">requestedForType</th>
                <th scope="col" class="px-6 py-3">requestedForId</th>
                <th scope="col" class="px-6 py-3">createdAt</th>
                <th scope="col" class="px-6 py-3">approvalStatus</th>
              </tr>
          </thead>
          <tbody>`;

  requests.reverse().map((entry) => {
    HTML += `
          <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
       
            <th class="px-6 py-4">${entry.requestType}</th>
            <th class="px-6 py-4" scope="row">${entry.data}</th>
            <th class="px-6 py-4" scope="row">${entry.approvalCode}</th>
            <th class="px-6 py-4" scope="row">${entry.approver}</th>
            <th class="px-6 py-4" scope="row">${entry.requestedBy}</th>
            <th class="px-6 py-4" scope="row">${entry.requestedForType}</th>
            <th class="px-6 py-4" scope="row">${entry.requestedForId}</th>
            <th class="px-6 py-4" scope="row">${entry.createdAt}</th>
            <th class="px-6 py-4" scope="row">${entry.approvalStatus}</th>
          </tr>`;
  });

  HTML += `
          
      </tbody>
  </table>
  </div>
  
      `;

  return HTML;
}

function resourceOverviewTab(resource, fields, action) {
  let edit = action === "edit" && true;

  let HTML;

  HTML = `
  <form class="space-y-6" action="#"> 
  
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

  let editFields = fields.filter(
    (field) => field !== "cost" && field !== "utilisation"
  );
  editFields.map((field) => {
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

export { showCostTab, resourceOverviewTab, showBudgetTab, showRequestTab };
