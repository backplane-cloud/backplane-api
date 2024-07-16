// This is a LoginForm Web Component

const template = (version, release) => `
<div id="loginSection" class="mt-32">

    <form class="max-w-sm mx-auto" id="loginForm"     
      hx-get="/api/users/check-auth"
      hx-target="#loginSection" 
      hx-swap="innerHTML">
      
      <img src="img/backplane-logo-black.svg" class="mx-auto w-64" />

      <h1 class="m-10 align-start font-bold text-2xl text-slate-900">
      Backplane Cloud Console
    </h1>
      <div class="mb-5">
        <label
          for="email"
          class="block mb-2 text-lg font-medium text-slate-700 dark:text-white"
        >
          Email
        </label>
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
          for="password"
          class="block mb-2 text-lg font-medium text-slate-700 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      


      <div hx-boost="true" class="flex justify-between mt-5">
        <button
          hx-swap="outerHTML"
          hx-target="#loginSection"
          hx-post="/api/users/login"
          hx-headers='{"ui": true}'
          type="submit"
          class="w-32 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"
        >
          Login
        </button>
        <button
          
          hx-get="/api/users/register"
          hx-target="#loginSection"
          class="w-32 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"

        >
          Register
        </button>
        
      </div>
     
      <div class="text-red"></div>
    </form>
  </div>`;

export default class LoginForm extends HTMLElement {
  constructor() {
    super();
    let version = this.getAttribute("version");
    let release = this.getAttribute("release");
    // this.attachShadow({ mode: "open" });
    // this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.innerHTML = template(version, release);
  }
}

window.customElements.define("login-form", LoginForm);
