const parseXlsx = require('excel').default
module.exports = function parseExcelMethod (sheet) {
  return parseXlsx(sheet)
}
