
export interface ContactOptions {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
}

export interface AppointmentOptions {
  calendarId: string;
  locationId: string;
  contactId: string;
  startTime: string;
  title?: string;
}

export interface ContactResult {
  meta?: {
    matchingField?: string;
    contactId?: string;
  };
  contact?: {
    id?: string;
  };
}