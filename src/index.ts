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

		const html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>LC Create Appointment</title>
			</head>
			<body>
				<h1>LC Create Appointment</h1>
				<p>To create an appointment, send a POST request to this endpoint with the following JSON body:</p>
				<pre>
				<code>
{
	"phone": "1234567890",
	"locationId": "loc123",
	"calendarId": "cal123",
	"startTime": "2023-10-10T10:00:00Z",
	"firstName": "John",
	"lastName": "Doe",
	"email": "john.doe@example.com",
	"name": "John Doe",
	"title": "Meeting"
}
				</code>
				</pre>
				<p>Make sure to include an Authorization header with a Bearer token.</p>
				<h2>Example Request (cURL)</h2>
				<pre>
				<code>
curl -X POST http://localhost:8787/ \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_TOKEN_HERE" \\
-d '{
	"phone": "1234567890",
	"locationId": "loc123",
	"calendarId": "cal123",
	"startTime": "2023-10-10T10:00:00Z",
	"firstName": "John",
	"lastName": "Doe",
	"email": "john.doe@example.com",
	"name": "John Doe",
	"title": "Meeting"
}'
				</code>
				</pre>
				<h2>Example Request (JavaScript)</h2>
				<pre>
				<code>
fetch('http://localhost:8787/', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer YOUR_TOKEN_HERE'
	},
	body: JSON.stringify({
		phone: '1234567890',
		locationId: 'loc123',
		calendarId: 'cal123',
		startTime: '2023-10-10T10:00:00Z',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		name: 'John Doe',
		title: 'Meeting'
	})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
				</code>
				</pre>
			</body>
			</html>
		`;

		return new Response(html, {
			headers: { 'Content-Type': 'text/html' },
		});
	},
} satisfies ExportedHandler<Env>;
