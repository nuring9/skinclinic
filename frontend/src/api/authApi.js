import api from "@/api/apiClient";

export async function fetchCurrentUser() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function login({ loginId, password }) {
  const body = new URLSearchParams();
  body.set("username", loginId);
  body.set("password", password);

  await api.post("/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return fetchCurrentUser();
}

export async function logout() {
  await api.post("/logout");
}

export async function signUp(payload) {
  const response = await api.post("/api/members/signup", payload);
  return response.data;
}

export async function sendSignupEmailCode(email) {
  const response = await api.post("/api/members/email/send", { email });
  return response.data;
}

export async function verifySignupEmailCode({ email, code }) {
  const response = await api.post("/api/members/email/verify", { email, code });
  return response.data;
}
