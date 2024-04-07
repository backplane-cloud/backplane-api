// function resourceListView(jsonObject, fields, title, type) {
//   let html = `

// <div>

//   <nav class="flex mb-10" aria-label="Breadcrumb">
//     <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
//       <li class="inline-flex items-center">
//         <a href="#" hx-get='/api/users/check-auth' hx-target="#main-window" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
//           <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//             <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
//           </svg>
//           Home
//         </a>
//       </li>
//       <li aria-current="page">
//         <div class="flex items-center">
//           <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
//           </svg>
//           <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">${title}</span>
//         </div>
//       </li>
//     </ol>
//   </nav>

//   <form class=" mx-auto">
//   <div class="relative">
//     <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//         <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
//         </svg>
//     </div>
//     <input type="search" name="q"
//       hx-headers='{"ui": true}'
//       hx-get="/api/${type}/search"
//       hx-trigger="keyup changed delay:500ms"
//       hx-target="#display-content"
//       id="${type}-search"
//       class="block w-96 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ${title}" required />
// </div>
// </form>

//   <button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/create" hx-target="#display-content" hx-headers='{"ui": true, "action": "create"}'>Create ${title.substring(
//     0,
//     title.length - 1
//   )}</button>

//       <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"><tr>`; // Start with a table
//   html +=
//     '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr>'; // Start a table row for header
//   fields.map((field) => {
//     html += '<th scope="col" class="px-6 py-3">' + field + "</th>"; // Key as table header
//   });

//   html += "</tr></thead>"; // Close the table header row
//   if (jsonObject.length === undefined) {
//     jsonObject = [jsonObject];
//   }
//   if (jsonObject.length !== 0) {
//     // Create table rows for values

//     jsonObject.map((entity) => {
//       html += '<tr scope="col" class="px-6 py-3">';
//       fields.map((field, i) => {
//         let value = entity[field] === undefined ? "Not Set" : entity[field];

//         let meta =
//           i === 0
//             ? ` class="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" hx-get="/api/${type}/${entity.id}" hx-target="#display-content" hx-headers='{"ui": true, "action": "view"}'`
//             : `class="px-6 py-4"`;
//         let clouds = ["azure", "gcp", "aws"];
//         if (clouds.includes(value)) {
//           value = `<img src='img/${value}.png'/>`;
//         }

//         if (field === "repo" && entity[field] !== "No Repo") {
//           value = `<img src='img/github.png'/>`;
//         }

//         switch (field) {
//           case "orgId":
//             html += `<td class='text-blue-500'><a href='#' hx-get="/api/orgs/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
//             break;
//           case "ownerId":
//             html += `<td class='text-blue-500'><a href='#' hx-get="/api/users/${value}" hx-target="#display-content" hx-headers='{"ui": true}'>${value}</a></td>`;
//             break;
//           default:
//             html += `<td ${meta}>${value}</td>`; // Value cell
//         }
//       });
//       html += "</tr>"; // Close the value row
//     });
//   } else {
//     html += `<tr><td colspan='${fields.length}'><h2 class='mt-10'>No ${title} Found</h2></td></tr>`;
//   }

//   html += "</table></div>"; // Close the table
//   return html;
// }

// View the Resource
// function resourceView(resource, tabs) {
//   let resourceType = resource.type + "s";
//   let resourceDisplay =
//     resourceType.charAt(0).toUpperCase() + resource.type.slice(1);

//   let HTML = `
//     <div>
//         <nav class="flex mb-10" aria-label="Breadcrumb">
//         <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
//             <li class="inline-flex items-center">
//             <a href="#" hx-get='/api/users/check-auth' hx-target='#main-window' hx-headers='{"ui": true}' class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
//                 <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
//                 </svg>
//                 Home
//             </a>
//             </li>
//             <li>
//             <div class="flex items-center">
//                 <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <a href="#" hx-get='/api/${resourceType}' hx-target='#display-content' hx-headers='{"ui": true}' class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">${resourceDisplay}s</a>
//             </div>
//             </li>
//             <li aria-current="page">
//             <div class="flex items-center">
//                 <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">${resource.name}</span>
//             </div>
//             </li>
//         </ol>
//         </nav>

//   <h3 class="leading-7 text-gray-900 text-3xl mb-10">
//   ${resource.name}
//   </h3>

//     <div class="border-b border-gray-200 dark:border-gray-700">
//       <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">`;

//   tabs.map((tab) => {
//     HTML += `<li class="me-2">
//               <a
//                 href="#"
//                 hx-target='#resource-content' hx-get='/api/${resourceType}/${resource.id}/${tab}' hx-headers='{"ui": true}'
//                 class="inline-flex items-center text-blue-500 justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
//               >${tab}</a>
//             </li>`;
//   });

//   HTML += `</ul>
//     </div>

//   </div>
//   `;

//   HTML += "<div id='resource-content' class=''></div>";

//   HTML += `

//         </dl>
//       </div>
//     </div>
//     `;
//   return HTML;
// }

// Create Resources View

// Old Functions to refactor to Web Components

// Login Form
// function loginHTMX(message) {
//   let HTML = `

// <div
// id="loginSection"
// hx-get="/api/users/check-auth"
// hx-target="#loginSection"
// class="mt-0"
// >

// <form
//   class="max-w-sm mx-auto"
//   id="loginForm"

// ><img src='img/backplane-logo-text.png' class='mx-auto'/>

// <h1 class='text-3xl mb-10'>Login</h1>
//   <div class="mb-5">
//     <label
//       for="email"
//       class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//       >Your email</label
//     >
//     <input
//       type="email"
//       id="email"
//       name="email"
//       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//       placeholder="user@backplane.cloud"
//       required
//     />
//   </div>
//   <div class="mb-5">
//     <label
//       for="password"
//       class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//       >Your password</label
//     >
//     <input
//       type="password"
//       name="password"
//       id="password"
//       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//       required
//     />
//   </div>
//   <div class="flex items-start mb-5">
//     <div class="flex items-center h-5">
//       <input
//         id="remember"
//         type="checkbox"
//         value=""
//         class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
//         required
//       />
//     </div>
//     <label
//       for="remember"
//       class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
//       >Remember me</label
//     >
//   </div>

//   <div hx-boost="true" class="flex">
//   <button
//     hx-swap="outerHTML"
//   hx-target="#loginSection"
//   hx-post="/api/users/login"
//   hx-headers='{"ui": true}'
//     type="submit"
//     class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//   >
//     Submit
//   </button>
//     <a href="#" hx-get="/api/users/register" hx-target="#loginSection" class="ml-5">No Account ? Register </a>
//   </div>
//   <div class="text-red"></div>
// </form>
// </div>`;

//   return HTML;
// }
