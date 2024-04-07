function appshell(name, email, orgId, userType) {
  let html = `

<div class="min-h-full" id="main-window">

  <header>
    <div class="flex items-center justify-between">
      <div class="flex">
        <img
          class="h-10 m-2"
          src="img/backplane-logo.png"
          alt="Backplane Software"
        />

        <img
          class="h-10 m-2"
          src="img/backplane-logo-text.png"
          alt="Backplane Software"
        />
      </div>
      <div>
        <search-box type="products" title="Backplane"></search-box>
      </div>
      <div class="flex items-center justify-end>

        <div class="justify-end bg-blue-200">Logged in as ${name} (${email})</div>

        <button 
          hx-target="#datapane" 
          hx-headers='{"ui": true, "action": "logout"}' 
          hx-post='/api/users/logout' 
          class="m-3 justify-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>


      </div>
    </div>
    

    <div class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Management Console
        </h1>
      </div>
      <div>     
        <nav-bar target='display-content' menu="Dashboard,Orgs,Platforms,Products,Apps,Requests,Services"></nav-bar>
      </div>
    </div>

  </header>

  <main>
    <div id="display-content" class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">Welcome back ${name}</div>
  </main>
</div>
`;

  return html;
}

export { appshell };
