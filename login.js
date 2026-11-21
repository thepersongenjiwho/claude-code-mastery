const form = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const status = document.getElementById("status");
const toggle = document.getElementById("toggle-pw");

toggle.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  toggle.textContent = show ? "숨김" : "보기";
  toggle.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 표시");
});

function setError(input, message) {
  document.getElementById(input.id + "-error").textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validate() {
  let ok = true;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) { setError(email, "이메일을 입력해 주세요."); ok = false; }
  else if (!emailRe.test(email.value)) { setError(email, "올바른 이메일 형식이 아닙니다."); ok = false; }
  else setError(email, "");

  if (!password.value) { setError(password, "비밀번호를 입력해 주세요."); ok = false; }
  else if (password.value.length < 8) { setError(password, "비밀번호는 8자 이상이어야 합니다."); ok = false; }
  else setError(password, "");
  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "status";
  status.textContent = "";
  if (!validate()) return;

  const btn = form.querySelector(".primary");
  btn.disabled = true;
  status.textContent = "로그인 중...";
  try {
    // TODO: 실제 API 엔드포인트로 교체하세요.
    // const res = await fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email: email.value, password: password.value }),
    // });
    // if (!res.ok) throw new Error();
    await new Promise((r) => setTimeout(r, 600)); // 데모용 지연
    status.className = "status ok";
    status.textContent = "로그인 성공! (데모)";
  } catch {
    status.className = "status fail";
    status.textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
  } finally {
    btn.disabled = false;
  }
});
