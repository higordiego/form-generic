const fs = require('fs')
const path = require('path')

const parseObject = (list, dir) => list.reduce((acc, value) => {
  const obj = fs.readdirSync(`${dir}/${value}`)
  obj.map(a => acc.push({ object: a, root: `${value}`, dir: `${dir}/${value}/${a}` }))
  acc = acc.filter(a => a.object !== 'case.js')
  return acc
}, [])

const generateRoute = (list, app) => list.map(val => {
  const c = require(val.dir)
  let args = [`/api${c.path}`]
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
    console.warn('Error in generate modules routes express.')
  }
}
