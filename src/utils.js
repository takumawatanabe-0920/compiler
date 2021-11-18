export function isWhiteSpace(ch) {
  return /^[ \n\r\t]$/.test(ch);
}

export function isDigit(ch) {
  return /^\d$/.test(ch);
}

export function isIdentifierStartChar(ch) {
  return /^[A-Za-z]$/.test(ch);
}

export function isIdentifierChar(ch) {
  return /^[A-Za-z0-9]$/.test(ch);
}

export function numberOfDigit(ch) {
  return ch.charCodeAt(0) - "0".charCodeAt(0);
}