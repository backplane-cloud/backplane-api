// This is a LoginForm Web Component

const template = `
<div
    id="loginSection"
    hx-get="/api/users/check-auth"
    hx-target="#loginSection"
    class="mt-0"
  >
    <form class="max-w-sm mx-auto" id="loginForm">
      <img src="img/backplane-logo-text.png" class="mx-auto" />

      <h1 class="text-3xl mb-10">Login</h1>
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

      <div hx-boost="true" class="flex">
        <button
          hx-swap="outerHTML"
          hx-target="#loginSection"
          hx-post="/api/users/login"
          hx-headers='{"ui": true}'
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
        <a
          href="#"
          hx-get="/api/users/register"
          hx-target="#loginSection"
          class="ml-5"
        >
          No Account ? Register{" "}
        </a>
      </div>
      <div class="text-red"></div>
    </form>
  </div>`;

export default class LoginForm extends HTMLElement {
  constructor() {
    super();

    // this.attachShadow({ mode: "open" });
    // this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.innerHTML = template;
  }
}

window.customElements.define("login-form", LoginForm);
