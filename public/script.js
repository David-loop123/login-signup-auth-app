(() => {
  const form = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginBtn");
  const themeToggle = document.getElementById("themeToggle");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector(".password-toggle");
  const loginMessage = document.getElementById("loginMessage");

  const LOADING_CLASS = "loading";
  const LIGHT_THEME_CLASS = "light";
  const THEME_KEY = "app_theme";

  /* =====================
     Theme Handling
  ====================== */
  function applyTheme(theme) {
    const isLight = theme === LIGHT_THEME_CLASS;
    document.body.classList.toggle(LIGHT_THEME_CLASS, isLight);
    themeToggle.textContent = isLight ? "🌞" : "🌙";
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === LIGHT_THEME_CLASS ? LIGHT_THEME_CLASS : "dark");

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle(LIGHT_THEME_CLASS);
    const theme = isLight ? LIGHT_THEME_CLASS : "dark";
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.textContent = isLight ? "🌞" : "🌙";
  });

  /* =====================
     Password Toggle
  ====================== */
  passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordToggle.textContent = isPassword ? "🙈" : "👁️";
  });

  /* =====================
     Form Validation
  ====================== */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    clearFormMessage();

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.value.trim(),
          password: form.password.value.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      // ✅ Inline messages instead of alert
      loginMessage.textContent = data.message;
      loginMessage.className = `form-message ${data.success ? "success" : "error"}`;
      loginMessage.style.display = "block";

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");

        form.reset(); 
        clearErrors();

      // Redirect to dashboard
       window.location.href = "dashboard.html";
}


    } catch (err) {
      setLoading(false);
      console.error(err);
      loginMessage.textContent = "Server error. Try again later.";
      loginMessage.className = "form-message error";
      loginMessage.style.display = "block";
    }
  });

  function setLoading(isLoading) {
    loginButton.classList.toggle(LOADING_CLASS, isLoading);
    loginButton.disabled = isLoading;
  }

  function validateForm() {
    let valid = true;
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (username.length < 3) {
      showError(form.username, "Username must be at least 3 characters");
      valid = false;
    }

    if (password.length < 6) {
      showError(form.password, "Password must be at least 6 characters");
      valid = false;
    }

    if (!valid) {
      const firstErrorInput = form.querySelector("input.error");
      firstErrorInput.focus();
    }

    return valid;
  }

  function showError(input, message) {
    input.classList.add("error");
    const errorEl = input.closest(".form-group").querySelector(".error-message");
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    const errorInputs = form.querySelectorAll("input.error");
    errorInputs.forEach((input) => input.classList.remove("error"));

    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((el) => (el.textContent = ""));
  }

  function clearFormMessage() {
    loginMessage.style.display = "none";
    loginMessage.textContent = "";
  }
})();
