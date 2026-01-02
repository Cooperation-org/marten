// Taiga API client with auth handling

// Use env variable in production, proxy in dev
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean | undefined>;
}

class TaigaClient {
	private token: string | null = null;

	constructor() {
		if (typeof window !== 'undefined') {
			this.token = localStorage.getItem('taiga_token');
		}
	}

	setToken(token: string) {
		this.token = token;
		if (typeof window !== 'undefined') {
			localStorage.setItem('taiga_token', token);
		}
	}

	clearToken() {
		this.token = null;
		if (typeof window !== 'undefined') {
			localStorage.removeItem('taiga_token');
		}
	}

	private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		const { params, ...fetchOptions } = options;

		let url = `${API_BASE}${endpoint}`;
		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, String(value));
				}
			});
			const queryString = searchParams.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...(options.headers || {})
		};

		if (this.token) {
			(headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
		}

		const response = await fetch(url, {
			...fetchOptions,
			headers
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ detail: 'Request failed' }));
			throw new Error(error.detail || `HTTP ${response.status}`);
		}

		if (response.status === 204) {
			return undefined as T;
		}

		// Handle empty responses
		const text = await response.text();
		if (!text) {
			return undefined as T;
		}

		return JSON.parse(text);
	}

	get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
		return this.request<T>(endpoint, { method: 'GET', params });
	}

	post<T>(endpoint: string, data?: unknown) {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	patch<T>(endpoint: string, data: unknown) {
		return this.request<T>(endpoint, {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	put<T>(endpoint: string, data: unknown) {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	delete<T>(endpoint: string) {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}
}

export const api = new TaigaClient();
export default api;
