"use client";

import { showAlert } from "@/util/show-alert";

import type { User } from "@/types/user";
import { APIURL } from "@/contexts/action";

import { getLoginSession, saveLoginSession } from "./session";

// function generateToken(): string {
// 	const arr = new Uint8Array(12);
// 	globalThis.crypto.getRandomValues(arr);
// 	return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
// }

const user = {
	id: "USR-000",
	avatar: "/assets/avatar.png",
	firstName: "Sofia",
	lastName: "Rivers",
	email: "sofia@devias.io",
} satisfies User;

export interface SignUpParams {
	fullName: string;
	phoneNumber: string;
	email: string;
	password: string;
	address: string;
}

export interface SignInWithOAuthParams {
	provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
	email: string;
	password: string;
}

export interface ResetPasswordParams {
	email: string;
}

class AuthClient {
	// async signUp(_: SignUpParams): Promise<{ error?: string }> {
	//   // Make API request

	//   // We do not handle the API, so we'll just generate a token and store it in localStorage.
	//   const token = generateToken();
	//   localStorage.setItem('custom-auth-token', token);

	//   return {};
	// }
	async signUp(values: SignUpParams): Promise<{ error?: string }> {
		try {
			const response = await fetch(`${APIURL}/Users/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName: values.fullName,
					email: values.email,
					password: values.password,
					phoneNumber: values.phoneNumber,
					address: values.address,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data.Status) {
				await showAlert("error", data.Message || "Registration failed. Please try again.");
				return { error: data.Message || "Registration failed. Please try again." };
			}

			await showAlert("success", data.Message || "Registration successful!");

			// If you want to store a fake token for now:
			// const token = generateToken();
			// localStorage.setItem('custom-auth-token', token);

			return {}; // success, no error
		} catch (error: any) {
			console.error(error);
			await showAlert("error", error.message || "Registration failed. Please try again.");
			return { error: error.message || "Registration failed." };
		}
	}
	async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
		return { error: "Social authentication not implemented" };
	}

	async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
		//const { email, password } = params;
		try {
			const response = await fetch(`${APIURL}/Users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: params.email,
					password: params.password,
				}),
			});

			const data = await response.json();
			if (!response.ok || !data.status) {
				await showAlert("error", data.Message || "Login failed. Please try again.");
				return { error: data.Message || "Login failed. Please try again." };
			}
			if (!data.status) {
				await showAlert("error", data.Message || "Login failed. Please try again.");
				return { error: data.Message || "Login failed. Please try again." };
			}

			await showAlert("success", data.Message || "Login successful!");

			saveLoginSession(data.data);
			return {}; // success, no error
		} catch (error: any) {
			console.error(error);
			await showAlert("error", error.message || "Registration failed. Please try again.");
			return { error: error.message || "Registration failed." };
		}
	}

	async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
		return { error: "Password reset not implemented" };
	}

	async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
		return { error: "Update reset not implemented" };
	}

	async getUser(): Promise<{ data?: User | null; error?: string }> {
		// Make API request
		const all = getLoginSession();
		// We do not handle the API, so just check if we have a token in localStorage.
		const token = all.token;

		if (!token) {
			return { data: null };
		}

		return { data: user };
	}

	async signOut(): Promise<{ error?: string }> {
		// Remove custom auth token from localStorage
		localStorage.removeItem("custom-auth-token");

		// Remove all related sessionStorage items
		sessionStorage.removeItem("buildingType");
		sessionStorage.removeItem("landType");
		sessionStorage.removeItem("propertyTypes");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("role");
		sessionStorage.removeItem("email");
		sessionStorage.clear();
		//setState({ user: null, error: null, isLoading: false });
		return {};
		
	}
}

export const authClient = new AuthClient();
// function setState(arg0: { user: null; error: null; isLoading: boolean; }) {
// 	throw new Error("Function not implemented.");
// }

