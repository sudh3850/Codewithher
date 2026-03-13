// Simulated data for safe zones like police stations, hospitals, etc.
export const getSafeZones = (userLat, userLng) => {
  if (!userLat || !userLng) return [];
  
  // Create some simulated safe zones around the user
  return [
    { id: 1, type: 'Police Station', name: 'City Central Police', lat: userLat + 0.005, lng: userLng + 0.005 },
    { id: 2, type: 'Hospital', name: 'Hope General Hospital', lat: userLat - 0.004, lng: userLng + 0.002 },
    { id: 3, type: '24/7 Store', name: 'SafeMart', lat: userLat + 0.002, lng: userLng - 0.006 },
    { id: 4, type: 'Metro Station', name: 'Downtown Metro', lat: userLat - 0.008, lng: userLng - 0.004 }
  ];
};
