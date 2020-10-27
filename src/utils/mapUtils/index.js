export function getStaticMap({
  key,
  size = '700x300',
  center,
  markers,
  mapType = 'roadmap',
  zoom = '10',
} = {}) {
  return `https://maps.googleapis.com/maps/api/staticmap?key=${key}&maptype=${mapType}&zoom=${zoom}&size=${size}&center=${center}&markers=${markers ||
    center}`
}

export function getDestinationUrl({ destination }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`
}
