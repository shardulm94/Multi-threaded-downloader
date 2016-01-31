/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const createFD = require('./createFD')
const initMTD = require('./initMTD')
const initParams = require('./initParams')
const downloadMTD = require('./downloadMTD')

class Download {
  constructor (ob, options) {
    this.options = initParams(options)
    this.ob = ob
    this.fd = createFD(ob, this.options.mtdPath)
  }

  start () {
    return this
      .init()
      .flatMap(() => this.download())
  }

  init () {
    return initMTD(this.ob, this.fd('w'), this.options)
  }

  download () {
    const fd = this.fd('r+')
    const options = this.options
    const ob = this.ob
    return downloadMTD(ob, fd)
      .last()
      .flatMap(x => ob.fsTruncate(options.mtdPath, x.totalBytes))
      .flatMap(() => ob.fsRename(options.mtdPath, options.path))
  }

  stop () {
  }
}
module.exports = Download