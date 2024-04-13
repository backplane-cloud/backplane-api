export default class SelectPicker extends HTMLElement {
  constructor() {
    super();

    const collection = JSON.parse(this.getAttribute("collection"));
    const field = this.getAttribute("field");
    const label = this.getAttribute("label");

    let html = `<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select ${label}</label>
        <select id="${field}" name="${field}" class="select select-bordered w-full max-w-xs">`;

    collection.map(
      (item) => (html += `<option value='${item.id}'>${item.name}</option>`)
    );

    html += "</select>";

    this.innerHTML = html;
  }
}

window.customElements.define("select-picker", SelectPicker);
