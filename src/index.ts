/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handlePostRequest } from "./handlers/requests";

/**
 * Default export object containing the fetch handler.
 * 
 * @property fetch - Asynchronous function to handle incoming requests.
 * 
 * @param request - The incoming request object.
 * @param env - The environment object containing bindings and other configurations.
 * 
 * @returns A promise that resolves to a Response object.
 * 
 * The fetch function handles POST requests by delegating to the handlePostRequest function.
 * For other request methods, it returns a JSON response with a "Hello World!" message.
 */
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'POST') {
			return handlePostRequest(request, env);
		}

		return new Response(JSON.stringify({ message: 'Hello World!' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
} satisfies ExportedHandler<Env>;
