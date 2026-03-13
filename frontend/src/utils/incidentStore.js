import { encodeData, decodeData } from './securityEncryption.js';

const INCIDENTS_KEY = 'safenest_incidents';
const SECURITY_LOGS_KEY = 'safenest_security_logs';

/**
 * --- INCIDENTS ---
 * Each incident contains:
 * incidentId, timestamp, triggerType, location, audioEvidence, videoEvidence, securityEvents
 */
export const saveIncident = (incident) => {
  const incidents = getIncidents();
  // Check if updating an existing incident
  const index = incidents.findIndex(i => i.id === incident.id);
  if (index >= 0) {
    incidents[index] = incident;
  } else {
    incidents.push(incident);
  }
  
  // Encode list of incidents
  const encoded = encodeData(incidents);
  localStorage.setItem(INCIDENTS_KEY, encoded);
};

export const getIncidents = () => {
  const data = localStorage.getItem(INCIDENTS_KEY);
  if (!data) return [];
  return decodeData(data) || [];
};

/**
 * --- SECURITY LOGS ---
 * Security logs contain events like:
 * - Unauthorized Access Attempt (with intruderPhoto optionally)
 * - Device Motion Distress Detected
 */
export const saveSecurityEvent = (event) => {
  const events = getSecurityEvents();
  events.push({
    ...event,
    timestamp: event.timestamp || new Date().toISOString()
  });
  
  const encoded = encodeData(events);
  localStorage.setItem(SECURITY_LOGS_KEY, encoded);
};

export const getSecurityEvents = () => {
  const data = localStorage.getItem(SECURITY_LOGS_KEY);
  if (!data) return [];
  return decodeData(data) || [];
};
