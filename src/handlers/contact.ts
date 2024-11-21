import { ContactOptions, ContactResult } from "../interfaces";

/**
 * Retrieves the contact ID from the LeadConnector service based on the provided phone number and location ID.
 *
 * @param {Env} env - The environment configuration object containing the LeadConnector URL.
 * @param {string} phone - The phone number of the contact to be retrieved.
 * @param {string} locationId - The location ID associated with the contact.
 * @param {string} authToken - The authorization token for authenticating the request.
 * @param {ContactOptions} [options={}] - Additional options to be included in the request body.
 * @returns {Promise<{ contactId: string } | ContactResult>} - A promise that resolves to an object containing the contact ID or the full contact result.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getContactId(env: Env, phone: string, locationId: string, authToken: string, options: ContactOptions = {}): Promise<{ contactId: string; } | ContactResult> {
  const url = `${env.LEADCONNECTOR_URL}/contacts/`;
  const body = {
    phone,
    locationId,
    ...options
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      Version: '2021-07-28',
      Authorization: authToken,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  };

  try {
    const response = await fetch(url, requestOptions);
    const result: ContactResult = await response.json();

    if (result?.meta?.matchingField) {
      if (result.meta.contactId) {
        return { contactId: result.meta.contactId };
      }
    }
    if (result?.contact?.id) {
      return { contactId: result.contact.id };
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}