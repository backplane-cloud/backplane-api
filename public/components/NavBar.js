export default class NavBar extends HTMLElement {
  constructor() {
    super();
    const menu = this.getAttribute("menu").split(","); // Array of Menu Items
    const target = this.getAttribute("target");
    const submenu = target === "resource-content" && true;
    const type = this.getAttribute("type") + "s";
    const resourceId = this.getAttribute("resourceId");
    console.log("type", type);
    console.log("resourceId", resourceId);
    console.log("submenu", submenu);
    let HTML = `
      <div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between flex-wrap">
          <div class="flex items-center">
            <div class="flex-shrink-0"></div>
            <div class="hidden md:block">
              <div class="flex flex-wrap items-baseline space-x-4">`;

    menu.map((item) => {
      if (resourceId) {
        HTML += `
        <a
          href="#"
          class="text-gray-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          hx-get="/api/${type}/${resourceId}/${item}"
          hx-target="#${target}"
          hx-headers='{"ui": true}'
          hx-indicator='#loading'
        >${item}</a
      >`;
      } else {
        HTML += `
        <a
          href="#"
          class="text-gray-900 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 text-sm font-medium"
          hx-get="/pages/${item}"
          hx-target="#${target}"
          hx-headers='{"ui": true}'
          hx-indicator='#loading'
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
