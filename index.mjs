export var MAX_LENGTH = 250

/**
 * HTML-escape a string like plug.dj escapes chat messages.
 */
export function escape (message) {
  return message
    .replace(/"/g, '&#34;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
}

/**
 * Reverse plug.dj's chat message escaping.
 */
export function unescape (message) {
  return message
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Get the size in bytes of a character in a plug.dj chat message.
 */
function byteLength (c) {
  // Escaped characters
  if (c === 34 /* " */ || c === 39 /* ' */ || c === 38 /* & */) {
    return 5
  }
  if (c === 60 /* < */ || c === 62 /* > */) {
    return 4
  }

  // Multi-byte unicode characters
  if (c > 0x7f && c <= 0x7ff) {
    return 2
  }
  if (c > 0x7ff && c <= 0xffff) {
    return 3
  }
  return 1
}

/**
 * Truncate a string to fit inside a plug.dj chat message.
 */
export function truncate (string) {
  var byteSize = 0
  for (var i = 0; i < string.length; i += 1) {
    var c = string.charCodeAt(i)
    var charSize = byteLength(c)

    if (byteSize + charSize > MAX_LENGTH) {
      return string.slice(0, i)
    }

    byteSize += charSize
  }

  return string
}

/**
 * Split a string into chunks that fit inside a plug.dj chat message. Splits on
 * characters, so it will break up words.
 */
export function splitRaw (string) {
  var parts = []
  // Character index delimiting the current chunk
  var start = 0
  // Size in bytes of the current chunk
  var byteSize = 0
  for (var i = 0; i < string.length; i += 1) {
    var c = string.charCodeAt(i)
    var charSize = byteLength(c)

    if (byteSize + charSize > MAX_LENGTH) {
      parts.push(string.slice(start, i))
      start = i
      byteSize = 0
    }

    byteSize += charSize
  }

  if (byteSize !== 0) {
    parts.push(string.slice(start))
  }

  return parts
}

/**
 * Split a string into chunks. Attempts to only split on whitespace.
 */
export function split (string) {
  var words = string.split(/(\S+\s+)/g)
  var parts = []
  var part = ''
  var size = 0
  for (var i = 0; i < words.length; i += 1) {
    var word = words[i]

    var wordSize = 0
    for (var c = 0; c < word.length; c += 1) {
      wordSize += byteLength(word.charCodeAt(c))
    }

    if (size + wordSize > MAX_LENGTH) {
      parts.push(part.replace(/\s+$/, ''))
      part = ''
      size = 0
    }

    part += word
    size += wordSize
  }

  if (size !== 0) {
    parts.push(part)
  }

  return parts
}
