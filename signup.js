/* =============================================
   MOVIESPHERE – SIGNUP LOGIC
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

// --- Password Strength Indicator ---
const passwordInput = document.getElementById("password");
const strengthWrap  = document.getElementById("strengthWrap");
const strengthBar   = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");

passwordInput?.addEventListener("input", () => {
  const val = passwordInput.value;

  if (!val) {
    if (strengthWrap) strengthWrap.style.display = "none";
    return;
  }
  if (strengthWrap) strengthWrap.style.display = "flex";

  let score = 0;
  if (val.length >= 8)              score++;
  if (val.length >= 12)             score++;
  if (/[A-Z]/.test(val))           score++;
  if (/[0-9]/.test(val))           score++;
  if (/[^A-Za-z0-9]/.test(val))    score++;

  let level, label;
  if      (score <= 1) { level = "weak";   label = "Weak"; }
  else if (score <= 3) { level = "medium"; label = "Medium"; }
  else                 { level = "strong"; label = "Strong 🔐"; }

  if (strengthBar)  { strengthBar.className = `strength-bar ${level}`; }
  if (strengthLabel){ strengthLabel.textContent = label; strengthLabel.className = `strength-label ${level}`; }
});

// --- Form Submission ---
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name     = document.getElementById("name")?.value.trim()    ?? "";
  const email    = document.getElementById("email")?.value.trim()   ?? "";
  const password = document.getElementById("password")?.value       ?? "";
  const btn      = document.getElementById("signupBtn");

  // --- Validation ---
  if (!name) {
    showMessage("⚠️ Please enter your full name.", "error"); return;
  }
  if (name.length < 2) {
    showMessage("⚠️ Name must be at least 2 characters.", "error"); return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("⚠️ Please enter a valid email address.", "error"); return;
  }
  if (password.length < 8) {
    showMessage("⚠️ Password must be at least 8 characters.", "error"); return;
  }

  // --- Loading state ---
  if (btn) { btn.textContent = "Creating Account…"; btn.disabled = true; }

  try {
    const response = await fetch("http://localhost:5002/api/users/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      showMessage("✅ Account created! Redirecting to sign in…", "success");
      setTimeout(() => { window.location.href = "login.html"; }, 1400);
    } else {
      showMessage(`⚠️ ${data.message || "Registration failed. Please try again."}`, "error");
      if (btn) { btn.textContent = "Create Account →"; btn.disabled = false; }
    }

  } catch (err) {
    console.error("Signup error:", err);
    showMessage("❌ Cannot reach server. Is the backend running on port 5002?", "error");
    if (btn) { btn.textContent = "Create Account →"; btn.disabled = false; }
  }
});
