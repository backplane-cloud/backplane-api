export default class PlatformPicker extends HTMLElement {
  constructor() {
    super();
    const platforms = JSON.parse(this.getAttribute("platforms"));
    console.log("platforms:", platforms);

    let html =
      '<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose a Platform</label><select id="platformId" name="platformId" class="select select-bordered w-full max-w-xs">';

    platforms.map(
      (platform) =>
        (html += `<option value='${platform.platformId}'>${platform.name}</option>`)
    );

    html += "</select>";

    this.innerHTML = html;
  }
}

window.customElements.define("platform-picker", PlatformPicker);
