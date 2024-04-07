export default class CreateButton extends HTMLElement {
  constructor() {
    super();
    const type = this.getAttribute("type");

    this.innerHTML = `<button type="submit" class="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" hx-get="/api/${type}/create" hx-target="#display-content" hx-headers='{"ui": true, "action": "create"}'>Create ${type.substring(
      0,
      type.length - 1
    )}</button>`;
  }
}

window.customElements.define("create-button", CreateButton);
