import Breadcrumb from "./Breadcrumb.js";
import CreateButton from "./CreateButton.js";
import ListView from "./ListView.js";
import LoginForm from "./LoginForm.js";
import NavBar from "./NavBar.js";
import SearchBox from "./SearchBox.js";

// Register global error handler for HTMX
document.body.addEventListener("htmx:error", function (event) {
  let detail = event.detail;
  if (detail.errorInfo.xhr.status === 401) {
    window.location.href = "/";
  }
});
