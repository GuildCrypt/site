function getIsHex(string) {
  for (let i = 0; i < string.length; i++) {
    if (isNaN(parseInt(string.charAt(i), 16))) {
      return false
    }
  }
  return true
}

export default function getIsAddressHexUnprefixed(addressHexUnprefixed) {
  if (typeof addressHexUnprefixed !== 'string') {
    return false
  }
  if (addressHexUnprefixed.length !== 40) {
    return false
  }
  return getIsHex(addressHexUnprefixed)
}
