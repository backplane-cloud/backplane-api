function appEnvironments(environments) {
  let HTML;

  HTML = `
  <button class="m-3 opacity-50 cursor-not-allowed text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Environment</button>
  <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  environments.map((env) => {
    HTML += `<li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>     
      </div> 
      <div class="ml-4 flex min-w-0 flex-1 gap-2">
        <span class="truncate font-medium">${env.name}</span>
      </div>
      <div class="ml-4 flex-shrink-0">
        <span class="truncate font-medium">${
          env.accountId ? env.accountId : ""
        }</span>
      </div>
 
    </li>`;
  });

  HTML += `</ul>
  </dd>




</div>`;

  return HTML;
}

function appAccess(access, cloud) {
  let HTML;

  HTML = `
  <button class="m-3 opacity-50 cursor-not-allowed text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add RBAC</button>
  <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
    

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Principal ID
        </th>
        <th scope="col" class="px-6 py-3">
                Type
            </th>
            <th scope="col" class="px-6 py-3">
            Environment
        </th>
            <th scope="col" class="px-6 py-3">
                Scope
            </th>
            
            <th scope="col" class="px-6 py-3">
                Role
            </th>
        
            <th scope="col" class="px-6 py-3">
                Action
            </th>
        </tr>
    </thead>
    <tbody>`;

  // Map through the Environments and then Assignments
  access.map((entry) => {
    entry.assignments.map((assignment) => {
      // Abstraction Mapping for Display
      let type, identity, scope, role, environment;
      switch (cloud) {
        case "azure": {
          type = assignment.principalType;
          identity = assignment.principalId;
          scope = entry.environment.accountId;
          role = assignment.principalId;
          environment = entry.environment.name;
          break;
        }
        case "aws": {
          type = assignment.Arn;
          identity = assignment.UserName;
          scope = entry.environment;
          role = assignment.Arn;
          environment = entry.environment;
          break;
        }
        case "gcp": {
          type = "";
          identity = assignment.member;
          scope = "";
          role = assignment.role;
          environment = entry.environments;
          break;
        }
      }
      HTML += `
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        ${identity}
    </td>
          <th scope="row">
              ${type}
          </th>
          <td class="px-6 py-4">
          ${environment}
      </td>
          <td class="px-6 py-4">
              ${scope}
          </td>
          <td class="px-6 py-4">
              ${role}
          </td>
      
          <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
          </td>
        </tr>`;
    });
  });

  HTML += `
        
    </tbody>
</table>
</div>

    `;

  return HTML;
}

function appPolicy(access, cloud) {
  let HTML;

  HTML = `
  <button class="m-3 opacity-50 cursor-not-allowed text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Policy</button>
  <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
    

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Principal ID
        </th>
        <th scope="col" class="px-6 py-3">
                Type
            </th>
            <th scope="col" class="px-6 py-3">
            Environment
        </th>
            <th scope="col" class="px-6 py-3">
                Scope
            </th>
            
            <th scope="col" class="px-6 py-3">
                Role
            </th>
        
            <th scope="col" class="px-6 py-3">
                Action
            </th>
        </tr>
    </thead>
    <tbody>`;

  // Map through the Environments and then Assignments
  access.map((entry) => {
    entry.assignments.map((assignment) => {
      // Abstraction Mapping for Display
      let type, identity, scope, role, environment;
      switch (cloud) {
        case "azure": {
          type = assignment.principalType;
          identity = assignment.principalId;
          scope = entry.environment.accountId;
          role = assignment.principalId;
          environment = entry.environment.name;
          break;
        }
        case "aws": {
          type = assignment.Arn;
          identity = assignment.UserName;
          scope = entry.environment;
          role = assignment.Arn;
          environment = entry.environment;
          break;
        }
        case "gcp": {
          type = "";
          identity = assignment.member;
          scope = "";
          role = assignment.role;
          environment = entry.environments;
          break;
        }
      }
      HTML += `
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        ${identity}
    </td>
          <th scope="row">
              ${type}
          </th>
          <td class="px-6 py-4">
          ${environment}
      </td>
          <td class="px-6 py-4">
              ${scope}
          </td>
          <td class="px-6 py-4">
              ${role}
          </td>
      
          <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Request Exemption</a>
          </td>
        </tr>`;
    });
  });

  HTML += `
        
    </tbody>
</table>
</div>

    `;

  return HTML;
}

export { appEnvironments, appAccess, appPolicy };
