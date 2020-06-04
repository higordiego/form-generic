const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(morgan('combined'))
app.use(compression())
app.use(helmet())
app.disable('x-powered-by')

const config = require('./config/campaign')

app.get('/form', (req, res) => {
  const { campaign, stage } = req.query

  const result = config.find(val => val.campaign === parseInt(campaign) && val.stage === parseInt(stage))
  res.status(200).json(result)
})

const port = process.env.PORT || 3000
const server = http.createServer(app)

require('./src/presenters/generateRoute')(app)

app.use((_, res) => res.status(404).json([{ title: '404', message: 'Route not found' }]))

app.get('/', (_, res) => res.sendFile(path.join(__dirname, './public', 'index.html')))

server.listen(port, () => console.info(`Server start in port: http://localhost:${port}`))

module.exports = app
