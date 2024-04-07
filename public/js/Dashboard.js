class Dashboard extends HTMLElement {
  constructor() {
    super();
    let html = `
            DASHBOARD COMPONENTS HERE
        `;
    this.innerHTML = html;
  }
}

window.customElements.define("dash-board", Dashboard);
