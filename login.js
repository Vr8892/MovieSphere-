/* =============================================
   MOVIESPHERE – LOGIN LOGIC
   ============================================= */

function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  if (!input) return;
  const isHidden = input.type === "password";
  input.type   = isHidden ? "text" : "password";
  if (btn) btn.textContent = isHidden ? "🙈" : "👁️";
}

function showMessage(text, type = "error") {
  const msg = document.getElementById("message");
  if (!msg) return;
  msg.textContent = text;
  msg.className   = type;
}

// Trigger login on button click or Enter key
document.getElementById("loginBtn")?.addEventListener("click", login);
document.getElementById("password")?.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});
document.getElementById("email")?.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});

async function login() {
  const email    = document.getElementById("email")?.value.trim()    ?? "";
  const password = document.getElementById("password")?.value ?? "";
  const btn      = document.getElementById("loginBtn");

  // --- Client-side validation ---
  if (!email || !password) {
    showMessage("⚠️ Please enter both email and password.", "error");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("⚠️ Please enter a valid email address.", "error");
    return;
  }
  if (password.length < 8) {
    showMessage("⚠️ Password must be at least 8 characters.", "error");
    return;
  }

  // --- Loading state ---
  if (btn) { btn.textContent = "Signing In…"; btn.disabled = true; }

  try {
    const response = await fetch("http://localhost:5002/api/users/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      // Store auth data
      localStorage.setItem("loggedInUser", data.user?.email || email);
      localStorage.setItem("userToken",    data.token);
      localStorage.setItem("userData",     JSON.stringify(data.user));

      showMessage("✅ Login successful! Redirecting…", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } else {
      showMessage(`⚠️ ${data.message || "Login failed. Please try again."}`, "error");
      if (btn) { btn.textContent = "Sign In →"; btn.disabled = false; }
    }

  } catch (err) {
    console.error("Login error:", err);
    showMessage("❌ Cannot reach server. Is the backend running on port 5002?", "error");
    if (btn) { btn.textContent = "Sign In →"; btn.disabled = false; }
  }
}
