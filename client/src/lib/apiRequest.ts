/**
 * A wrapper around the native fetch API to simplify making API requests.
 * It automatically sets JSON headers, stringifies the body, and handles basic HTTP errors.
 *
 * @param method The HTTP method (GET, POST, PATCH, DELETE).
 * @param url The API endpoint to request.
 * @param body Optional data to send in the request body.
 * @returns A promise that resolves with the JSON response.
 */
export async function apiRequest<T>(
	method: "GET" | "POST" | "PATCH" | "DELETE",
	url: string,
	body?: object
): Promise<T> {
	const options: RequestInit = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include", // Crucial for sending cookies with cross-origin requests
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response
			.json()
			.catch(() => ({ message: "An unknown error occurred" }));
		throw new Error(errorData.message || "API request failed");
	}

	// Handle cases where the response might be empty (e.g., for a 204 No Content)
	try {
		return await response.json();
	} catch (e) {
		return {} as T;
	}
}
