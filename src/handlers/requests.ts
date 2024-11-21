
import { getContactId } from "./contact";
import { createAppointment } from "./calendars";
import { ContactOptions, AppointmentOptions } from "../interfaces";

/**
 * Handles a POST request to create an appointment.
 *
 * @param {Request} request - The incoming request object.
 * @param {Env} env - The environment object containing environment variables and secrets.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 *
 * The function performs the following steps:
 * 1. Checks for the presence of an Authorization header with a Bearer token.
 * 2. Parses the JSON body of the request.
 * 3. Validates the presence of required fields: phone, locationId, calendarId, and startTime.
 * 4. Retrieves the contact ID using the provided phone number and location ID.
 * 5. Creates an appointment using the contact ID and other provided details.
 *
 * Possible response statuses:
 * - 200: Appointment created successfully.
 * - 400: Missing required fields or invalid JSON.
 * - 401: Unauthorized (missing or invalid Authorization header).
 * - 404: Contact not found.
 *
 * @example
 * const request = new Request('https://example.com', {
 *   method: 'POST',
 *   headers: { 'Authorization': 'Bearer token' },
 *   body: JSON.stringify({
 *     phone: '1234567890',
 *     locationId: 'loc123',
 *     calendarId: 'cal123',
 *     startTime: '2023-10-10T10:00:00Z',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com',
 *     name: 'John Doe',
 *     title: 'Meeting'
 *   })
 * });
 * const env = { /* environment variables and secrets *\/ };
 * const response = await handlePostRequest(request, env);
 */
export async function handlePostRequest(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let requestBody: {
    // required fields
    phone: string,
    locationId: string,
    calendarId: string,
    startTime: string,
    // Optional fields 
    firstName?: string,
    lastName?: string,
    email?: string,
    name?: string,
    title?: string,
  };

  try {
    requestBody = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { phone, locationId, calendarId, startTime, firstName, lastName, email, name, title } = requestBody;

  const missingFields = [];
  if (!phone) missingFields.push('phone');
  if (!locationId) missingFields.push('locationId');
  if (!calendarId) missingFields.push('calendarId');
  if (!startTime) missingFields.push('startTime');

  if (missingFields.length > 0) {
    return new Response(JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const options: ContactOptions = { firstName, lastName, email, name };

  const contactResponse = await getContactId(env, phone, locationId, authHeader, options);
  const contactId = 'contactId' in contactResponse ? contactResponse.contactId : undefined;

  if (contactId) {
    const appointmentOptions: AppointmentOptions = {
      calendarId,
      locationId,
      contactId,
      startTime,
      title,
    };

    const appointmentResponse: any = await createAppointment(env, authHeader, appointmentOptions);

    if ('statusCode' in appointmentResponse) {
      return new Response(JSON.stringify(appointmentResponse), {
        status: appointmentResponse.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(appointmentResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ error: 'Contact not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}