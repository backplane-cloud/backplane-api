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


      
        <div class="justify-end bg-blue-200">Logged in as  <span id='username'> </span>  (<span id='email'> </span>)</div>

        <div class="flex items-center">
          <div> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
              <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div><a class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded" href='https://backplane.dev/docs/cli'>Download CLI</a>
          </div>
      </div>
      
        <button 
          id='logoutButton'
          hx-target="#datapane" 
          hx-headers='{"ui": true, "action": "logout"}' 
          hx-post='/api/users/logout' 
          class="m-5 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded">Logout</button>


      </div>
    </div>
    

    <div class="bg-white shadow">
      <div class="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
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
    <div id="display-content" class="mx-auto max-w-full py-6 sm:px-6 lg:px-8">Welcome back <span id='welcome'></span></div>
  </main>










</div>

<footer class="bg-gray-100  py-4 text-center fixed bottom-0 w-full">
  <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
        <a href="https://backplane.dev/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src="/img/backplane-logo-black.png" class="h-12" alt="Backplane Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-blue">Backplane</span>
        </a>
        <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
                <a href="https://backplane.dev/docs/intro" class="hover:underline me-4 md:me-6">Documentation</a>
            </li>
            <li>
                <a href="https://backplane.dev/docs/cli" class="hover:underline me-4 md:me-6">Download CLI</a>
            </li>
            <li>
                <a href="https://backplane.dev/docs/quick-start" class="hover:underline me-4 md:me-6">Quick Start</a>
            </li>
   
            <li>
                <a href="https://api.backplane.dev/openapi/" class="hover:underline me-4 md:me-6">Swagger</a>
            </li>

            <li>
                <a href="https://github.com/backplane-cloud/" class="hover:underline me-4 md:me-6">GitHub</a>
            </li>
        </ul>
    </div>
  </div>
</footer>
        <script>
        
        document.body.addEventListener('htmx:afterRequest', function(event) {
       
          if (event.detail.pathInfo.requestPath === '/api/users/logout') {
            localStorage.clear()
          }
        }) 

          if (!localStorage.getItem("username")) {
            localStorage.setItem("username", '${name}');
            localStorage.setItem("email", '${email}');
            console.log("Username stored in local storage session variable.");
          }

        
          
          
          document.getElementById("username").textContent = localStorage.getItem("username");
          document.getElementById("welcome").textContent = localStorage.getItem("username");
          document.getElementById("email").textContent = localStorage.getItem("email");

        </script>
`;

  return html;
}

export { appshell };
