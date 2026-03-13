/**
 * Secure utilities for the SafeNest MVP.
 * Provides Base64 encoding/decoding and simulated AES functionality
 * to protect sensitive logs and media references.
 */

// Simple Base64 Encode
export const encodeData = (data) => {
  if (!data) return '';
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (error) {
    console.error('Encoding error:', error);
    return '';
  }
};

// Simple Base64 Decode
export const decodeData = (encodedData) => {
  if (!encodedData) return null;
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedData)));
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString; // Return as string if it isn't JSON
    }
  } catch (error) {
    console.error('Decoding error:', error);
    return null;
  }
};

// Simulate AES Encryption (MVP fallback is Base64 combined with a salt)
// In a real production app, crypto.subtle would be used here.
export const hashPasscode = (passcode) => {
  // Simple fake hash for MVP demonstration purposes
  return btoa(`salt_${passcode}_secure_hash`);
};

export const verifyPasscode = (passcode, hash) => {
  return hashPasscode(passcode) === hash;
};
