// Local development - Android emulator
export const API_BASE = "http://10.0.2.2:8000";

// For production deployment, use:
// export const API_BASE = "https://hiresenseai-4.onrender.com";

// For other local testing options:
// - Physical device on same Wi‑Fi: http://<YOUR_PC_IP>:8000
// - iOS simulator: http://localhost:8000

let token = null;

export const setToken = (t) => {
  token = t;
};

export const getToken = () => token;

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.detail || "Request failed";
    throw new Error(Array.isArray(msg) ? msg[0]?.msg || String(msg) : String(msg));
  }
  return data;
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email, password, full_name) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", {
    uri: file.uri,
    name: file.name || "resume.pdf",
    type: file.mimeType || "application/pdf",
  });
  const url = `${API_BASE}/upload-resume`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", body: form, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export async function generateQuestions(role, resumeData) {
  return request("/generate-questions", {
    method: "POST",
    body: JSON.stringify({ role, resume_data: resumeData }),
  });
}

export async function analyzeAnswers(answers, questions, role, resumeScore) {
  return request("/analyze-answers", {
    method: "POST",
    body: JSON.stringify({
      answers,
      questions,
      role,
      resume_score: resumeScore ?? undefined,
    }),
  });
}
