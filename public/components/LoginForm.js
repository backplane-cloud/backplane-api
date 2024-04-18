// This is a LoginForm Web Component

const template = (version, release) => `
<div id="loginSection" class="mt-32">

    <form class="max-w-sm mx-auto" id="loginForm"     
      hx-get="/api/users/check-auth"
      hx-target="#loginSection" 
      hx-swap="innerHTML">
      
      <img src="img/backplane-logo-black.png" class="mx-auto" />

      <h1 class="m-10 align-start text-2xl font-bold tracking-tight text-gray-900">
      Management Console Login
    </h1>
      <div class="mb-5">
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
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
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      
      <div class="flex items-start mb-5">
        <div class="flex items-center h-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            required
          />
        </div>
        <label
          for="remember"
          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Remember me
        </label>
      </div>

      <div hx-boost="true" class="flex justify-around">
        <button
          hx-swap="outerHTML"
          hx-target="#loginSection"
          hx-post="/api/users/login"
          hx-headers='{"ui": true}'
          type="submit"
          class="w-36 bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"
        >
          Login
        </button>
        <button
          
          hx-get="/api/users/register"
          hx-target="#loginSection"
          class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-black py-2 px-4 border border-blue hover:border-solid rounded"

        >
          Create Account
        </button>
        
      </div>
      <div class="text-xs mt-5">Version: ${version}-${release}</div>
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
