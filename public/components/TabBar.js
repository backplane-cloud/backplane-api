export default class TabBar extends HTMLElement {
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
                <div class="flex flex-wrap items-baseline tabs tabs-lifted tabs" role="tablist">`;

    menu.map((item) => {
      if (resourceId) {
        HTML += `
          <div
    
            id="${item}"
            class="tab" role="tab"
            hx-get="/api/${type}/${resourceId}/${item}"
            hx-target="#${target}"
            hx-headers='{"ui": true, "filter": "${type}", "filterid": "${resourceId}"}'
            hx-indicator='#loading'
            onclick="toggleTabActive(this)"
          >${item}</div>
        `;
      } else {
        HTML += `
          <a
            href="#"
            class="text-gray-900 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 text-sm font-medium"
            hx-get="/api/${item}"
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

    HTML += `
    <script>
        function toggleTabActive(clickedElement) {
        // Remove 'tab-active' class from all elements
        var elements = document.querySelectorAll('div');
        elements.forEach(function(element) {
            element.classList.remove('tab-active');
         });

        // Add 'tab-active' class to the clicked element
        clickedElement.classList.add('tab-active');
        }
    </script>
    `;
    this.innerHTML = HTML;
  }
}

window.customElements.define("tab-bar", TabBar);
