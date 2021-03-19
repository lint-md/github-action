/*
 * File: loader.js
 * Description: 处理动态 require 的 loader
 * Created: 2021-3-19 09:47:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

// TODO: 和 plugin 一起，抽离到单独的 repository 中，并由 plugin 将本 loader 注入到 webpack options 中
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

/**
 * 拼接 require 内容
 *
 * @param matcher 匹配成功后的匹配信息数组，其中每项内容如下：
 * - 匹配到的所有内容
 * - require 语句前内容
 * - PURE_REQUIRE__标记
 * - require 文本
 * - require 语句内包裹内容
 * - require 语句后内容 (常见的有分号)
 *
 * 例如： `/#__PURE_REQUIRE__/ require(foo)`
 * 将被处理成：`__WEBPACK_PURE_REQUIRE__(foo)`
 *
 * @author yuzhanglong
 * @date 2021-3-19 09:42:54
 */

const concatRequireString = (matcher) => {
  // [[return] [/*#__PURE_REQUIRE__*/] [require](['foo'])[;]]
  //     1                2               3         4     5
  if (matcher.length !== 6) {
    return matcher[0]
  }
  return `${matcher[1]} __WEBPACK_PURE_REQUIRE__(${matcher[4]})${matcher[5]}`
}