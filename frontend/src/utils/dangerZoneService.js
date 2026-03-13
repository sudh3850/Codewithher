// Simulated data for danger areas (areas with reported incidents)

// Haversine formula to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export const getDangerZones = (userLat, userLng) => {
  if (!userLat || !userLng) return [];
  // Simulated danger zones near the user
  return [
    { id: 1, name: 'Reported Incident Area', lat: userLat + 0.003, lng: userLng - 0.003, radius: 0.5 }, // 500m radius
    { id: 2, name: 'Caution Zone', lat: userLat - 0.005, lng: userLng - 0.005, radius: 0.3 }
  ];
};

export const checkDangerWarning = (userLat, userLng) => {
  if (!userLat || !userLng) return null;
  const zones = getDangerZones(userLat, userLng);
  for (const zone of zones) {
    const distanceKm = getDistanceFromLatLonInKm(userLat, userLng, zone.lat, zone.lng);
    if (distanceKm <= zone.radius) {
      return zone; // Return the zone user is inside
    }
  }
  return null;
}
