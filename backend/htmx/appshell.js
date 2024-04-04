function appshell() {
  let html = `

<div class="min-h-full" id="main-window">
  <img class="h-16 m-2" src="img/backplane-logo-text.png" alt="Backplane Software">
  
  <nav class="bg-gray-200">            
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-10 w-10" src="img/backplane-logo-black.png" alt="Backplane Software">
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/orgs' hx-target="#display-content" hx-headers='{"ui": true}'>Orgs</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/platforms' hx-target="#display-content" hx-headers='{"ui": true}'>Platforms</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/products' hx-target="#display-content" hx-headers='{"ui": true}'>Products</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/apps' hx-target="#display-content" hx-headers='{"ui": true}'>Apps</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/requests' hx-target="#display-content" hx-headers='{"ui": true}'>Requests</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/services' hx-target="#display-content" hx-headers='{"ui": true}'>Services</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/users' hx-target="#display-content" hx-headers='{"ui": true}'>Users</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/roles' hx-target="#display-content" hx-headers='{"ui": true}'>Roles</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/assignments' hx-target="#display-content" hx-headers='{"ui": true}'>Assignments</a>
              <a href="#" class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium" hx-get='/api/teams' hx-target="#display-content" hx-headers='{"ui": true}'>Teams</a>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            <div class="relative ml-3">
              <div>
                <button type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="absolute -inset-1.5"></span>
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" src="img/lewis-backplane-cloud.png" alt=""> 
                </button>
              </div>

              
              <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
                <a class="block px-4 py-2 text-sm text-gray-700 cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-2" hx-post="/api/users/logout" hx-headers='{"ui": true}' hx-target="#datapane">Sign out</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </nav>

  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Management Portal</h1>
    </div>
  </header>

  <main>      
   
    <div id="display-content" class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8" >

    </div>
  </main>
</div>

  `;

  return html;
}

export { appshell };
