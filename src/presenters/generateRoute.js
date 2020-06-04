const fs = require('fs')
const path = require('path')

/**
 * @function
 * @param  {Array} list
 * @param  {string} dir
 * @return {Array}
 */
const parseObject = (list, dir) => list.reduce((acc, value) => {
  const obj = fs.readdirSync(`${dir}/${value}`).find(a => a === 'index.js')
  acc.push({ object: obj, root: `${value}`, dir: `${dir}/${value}/${obj}` })
  return acc
}, [])

/**
 * @function
 * @param  {Array} list
 * @param  {any} app
 * @return {void}
 */
const generateRoute = (list, app) => list.map(val => {
  const c = require(val.dir)
  let args = [`${c.path}`]
  args = args.concat(c.middlewares)
  args.push(c.handler)
  app._router[c.method.toLowerCase()].apply(app._router, args)
})

module.exports = app => {
  try {
    const dir = path.join(__dirname, '../controllers')
    const listRoutes = fs.readdirSync(dir)
    const parse = parseObject(listRoutes, dir)
    generateRoute(parse, app)
  } catch (err) {
    console.log('err', err)
    console.warn('Error in generate modules routes express.')
  }
}
