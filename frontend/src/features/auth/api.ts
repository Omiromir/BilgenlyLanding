import type {
    ResetPasswordFormValues,
    SignInFormValues,
    SignUpFormValues,
} from "./types";

const API_URL = "http://localhost:5241"; // ← ваш порт бэкенда

// Сохранение токена и роли
function saveAuth(token: string, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role.toLowerCase());
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
}

export async function signIn(data: SignInFormValues & { rememberMe: boolean }) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    const result = await response.json();
    saveAuth(result.token, result.role);
    return result; // { token, username, email, role }
}

export async function signUp(data: SignUpFormValues) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: data.fullName,   // fullName → username
            email: data.email,
            password: data.password,
            role: data.role ?? "Student",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();
    saveAuth(result.token, result.role);
    return result;
}

export async function requestPasswordReset(_: ResetPasswordFormValues) {
    // Пока заглушка — этот функционал не реализован в бэкенде
    return new Promise((resolve) => window.setTimeout(resolve, 400));
}