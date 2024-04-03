function appView(jsonObject, fields, title, type, tab) {
  let HTML = ` 
  <div>
  <h3 class="text-base font-semibold leading-7 text-gray-900 text-4xl mb-10">
    ${title}
  </h3>




  <div class="border-b border-gray-200 dark:border-gray-700">
    <ul
      class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
    >
      <li class="me-2">
        <a
          href="#"
          hx-target='#app-content' hx-get='/api/apps/${
            jsonObject.id
          }/overview' hx-headers='{"ui": true}'
          class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          Overview
        </a>
      </li>
      <li class="me-2">
        <a
          href="#"
          class="inline-flex items-center justify-center p-4 rounded-t-lg dark:text-blue-500 dark:border-blue-500 group"
          
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          Users
        </a>
      </li>
      <li class="me-2">
        <a href='#'
        hx-target='#app-content' hx-get='/api/apps/${
          jsonObject.id
        }/environments' hx-headers='{"ui": true}'
        class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
          Environments
        </a>
      </li>
      <li class="me-2">
        <a href='#'
        hx-target='#app-content' hx-get='/api/apps/${
          jsonObject.id
        }/environments' hx-headers='{"ui": true}'
        class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
          jsonObject.repo === "No Repo" && "cursor-not-allowed"
        }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Repo
        </a>
      </li>
      <li class="me-2">
        <a
          href="#"
          hx-target='#app-content' hx-get='/api/apps/${
            jsonObject.id
          }/access' hx-headers='{"ui": true}'
          class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Access
        </a>
      </li>
      <li class="me-2">
        <a
          href="#"
          class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          Policy
        </a>
      </li>
      <li class="me-2">
        <a href="#" class="inline-flex p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>Cost
        </a>
      </li>
      
    </ul>
  </div>

  <div class="px-4 sm:px-0"></div>
  <div class="mt-6 border-t border-gray-100">
    <dl class="divide-y divide-gray-100"></dl>
  </div>
</div>
`;

  HTML += "<div id='app-content' class=''></div>";

  HTML += `
  
      </dl>
    </div>
  </div>
  `;
  return HTML;
}

function appEnvironments(environments) {
  let HTML;

  HTML = `
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
        <span class="truncate font-medium">${env.accountId}</span>
      </div>
 
    </li>`;
  });

  HTML += `</ul>
  </dd>




</div>`;

  return HTML;
}

function appOverview(app, fields) {
  let HTML;

  HTML = `
  <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += "<div id='app-content' class=''></div>";

  fields.map((field) => {
    let value;
    if (field === "cloud") {
      value = `<img src='img/${app[field]}.png' />`;
    } else {
      value = app[field];
    }

    HTML += `
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">${field}</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${value}</dd>
          </div>`;
  });

  HTML += "</div>";

  return HTML;
}

function appAccess(access, cloud) {
  let HTML;

  HTML = `
  <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">

    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    
    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += "<div id='app-content' class=''></div>";

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

export { appView, appOverview, appEnvironments, appAccess };
