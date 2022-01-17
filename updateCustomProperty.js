export function getCustomProperty(elem, prop) {
  return getComputedStyle(elem).getPropertyValue(prop) || 0;
}

export function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

export function incrementCustomProperty(elem, prop, inc) {
  let value = parseFloat(getCustomProperty(elem, prop)) + inc;
  setCustomProperty(elem, prop, value);
}
