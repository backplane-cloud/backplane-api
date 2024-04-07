export default class NavBar extends HTMLElement {
  constructor() {
    super();
    const menu = this.getAttribute("menu").split(","); // Array of Menu Items
    const target = this.getAttribute("target");

    const type = this.getAttribute("type") + "s";
    const resourceId = this.getAttribute("resourceId");
    console.log("type", type);
    console.log("resourceId", resourceId);

    let HTML = `
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0"></div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">`;

    menu.map((item) => {
      if (resourceId) {
        HTML += `
        <a
          href="#"
          class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          hx-get="/api/${type}/${resourceId}/${item}"
          hx-target="#${target}"
          hx-headers='{"ui": true}'
        >${item}</a
      >`;
      } else {
        HTML += `
        <a
          href="#"
          class="text-gray-900 hover:bg-gray-200 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          hx-get="/api/${item}"
          hx-target="#${target}"
          hx-headers='{"ui": true}'
        >${item}</a
      >`;
      }
    });

    HTML += `
              </div>
            </div>
          </div>
        </div>
      </div>`;

    this.innerHTML = HTML;
  }
}

window.customElements.define("nav-bar", NavBar);
