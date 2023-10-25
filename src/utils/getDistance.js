export const getDistance = (lat11, lon11, lat22, lon22) => {
  let lat1 = Number(lat11);
  let lon1 = Number(lon11);
  let lat2 = Number(lat22);
  let lon2 = Number(lon22);

  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    if (dist >= 1) {
      return dist.toFixed(2) + 'km';
    }
    dist = dist * 1000 + 'm';
    return Math.floor(dist);
  }
};
