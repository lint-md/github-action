module.exports = (source) => {
  const data = source.split('\n')
  for (let i = 0; i < data.length; i++) {
    const matcher = data[i].match(/(.*)(\/\*#__PURE_REQUIRE__\*\/) (require)\((.*)\)(.*)/)
    if (matcher) {
      data[i] = concatRequireString(matcher)
    }
  }
  return data.join('\n')
}
// `__WEBPACK_PURE_REQUIRE__(${data[1]})`

const concatRequireString = (matcher) => {
  // [[return] [/*#__PURE_REQUIRE__*/] [require](['foo'])[;]]
  //     1                2               3         4     5
  if (matcher.length !== 6) {
    return matcher[0]
  }
  return `${matcher[1]} __WEBPACK_PURE_REQUIRE__(${matcher[4]})${matcher[5]}`
}