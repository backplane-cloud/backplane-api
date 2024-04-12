export default class UserProfile extends HTMLElement {
  constructor() {
    super();
    const name = this.getAttribute("name");
    this.innerHTML = `
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-12 mr-10">
            <span id='profile'>${name.split(" ")[0][0]}${
      name.split(" ")[1][0]
    }</span>
          </div>
        </div> 
        `;
  }
}

window.customElements.define("user-profile", UserProfile);
