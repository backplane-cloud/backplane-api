// Function to check if JWT cookie is empty
async function checkAuthentication() {
  return fetch("/api/users/check-auth")
    .then((response) => response.json())
    .then((data) => data.isAuthenticated)
    .catch((error) => {
      console.error("Error checking authentication:", error);
      return false; // Assume user is not authenticated in case of error
    });
}

// Function to show login form if user is not authenticated
async function showLoginFormIfNeeded() {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    document.getElementById("login-section").style.display = "block";
  } else {
    document.getElementById("header-section").style.display = "block";
    document.getElementById("navigation-section").style.display = "block";
  }
}

// Show login form if JWT cookie is empty when the page loads
window.addEventListener("load", showLoginFormIfNeeded);

// Event listener for successful login response
document
  .getElementById("login-form")
  .addEventListener("htmx:response:success", function (event) {
    console.log("hello bunny");
    document.getElementById("login-section").style.display = "none";
    document.getElementById("header-section").style.display = "block";
    document.getElementById("navigation-section").style.display = "block";
    document.getElementById("success-message").style.display = "block";
  });

// Event listener for any response from login form
document
  .getElementById("login-form")
  .addEventListener("htmx:response", function (event) {
    if (event.detail.statusCode !== 200) {
      // Login failed
      document.getElementById("login-section").style.display = "block";
    }
  });

document.body.addEventListener("myEvent", function (evt) {
  alert("myEvent was triggered!");
});
