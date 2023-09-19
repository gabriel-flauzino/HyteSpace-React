class DataCache {
  constructor(initialCache) {
    this.cache = initialCache;
  }

  /**
   * 
   * @param {string | object[]} key Query key
   * @param {*?} value New value
   * @returns Setted value
   */
  set(key, value) {
    if (Array.isArray(key)) {
      key.forEach(query => {
        if (Array.isArray(query)) this.set(...query)
        else this.set(query?.key, query?.value)
      })
    } else return this.cache[key] = value
  }

  /**
   * 
   * @param {string} key Query key
   * @returns Query result
   */
  get(key) {
    return this.cache[key]
  }

  /**
   * 
   * @param {string | array} key Query key
   * @param {*?} def Default value
   * @returns {*?}
   */
  ensure(key, def) {
    if (Array.isArray(key)) {
      key.forEach(query => {
        if (Array.isArray(query)) return this.ensure(...query)
        else return this.ensure(query?.key, query?.default)
      })
    } else {
      if (this.get(key)) return this.get(key)
      return this.set(key, def);
    }
  }

  /**
   * 
   * @param {String} key Query value
   * @returns Whether key was deleted or not
   */
  delete(key) {
    return delete this.cache[key]
  }

  clear() {
    this.cache = {}
  }

  cache = {};
}

export default DataCache;