var assert = require('tapsert')
var m = require('./index')

assert.strictEqual(m.splitChars('Short and sweet').length, 1, 'Should not split short messages')
assert.strictEqual(m.splitWords('Short and sweet').length, 1, 'Should not split short messages')

// Hangul characters are grouped by syllable, but each syllable contains
// multiple letters and multiple bytes.
// plug.dj splits on the byte level, so it would cut off the last 안영하세요
// below in the middle of the 세 character.
var hangulStr = '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
                '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
                '안영하세요 안영하세요'

var result = m.splitChars(hangulStr)
assert.strictEqual(result[0],
  '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
  '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
  '안영하세요 안영하',
  'Should cut off before the 세 character'
)
assert.strictEqual(result[1],
  '세요',
  'Should put the remaining full characters in a new chunk'
)

result = m.splitWords(hangulStr)
assert.strictEqual(result[0],
  '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
  '안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 안영하세요 ' +
  '안영하세요',
  'Should cut off before the last word and trim ending whitespace'
)
assert.strictEqual(result[1],
  '안영하세요',
  'Should put the remaining words in a new chunk'
)

// 63 >s are escaped to &gt;, and then cut off in the middle of the last
// escaped character. After unescaping, the message would look like:
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>&g
var gtStr = '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
assert.strictEqual(
  m.truncate(gtStr).length,
  62,
  'Should truncate before the last >'
)
