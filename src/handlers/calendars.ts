
import { AppointmentOptions } from "../interfaces";

/**
 * Creates an appointment by sending a POST request to the LeadConnector API.
 *
 * @param {Env} env - The environment configuration object containing the LeadConnector URL.
 * @param {string} authToken - The authorization token for the API request.
 * @param {AppointmentOptions} options - The options for the appointment to be created.
 * @returns {Promise<any>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the API request fails.
 */
export async function createAppointment(env: Env, authToken: string, options: AppointmentOptions): Promise<any> {
  const url = `${env.LEADCONNECTOR_URL}/calendars/events/appointments`;
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: authToken,
      Version: '2021-04-15',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(options)
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}