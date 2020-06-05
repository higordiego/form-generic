
const { create } = require('../../database/abstract')

exports.path = '/campaign'
exports.method = 'POST'

exports.middlewares = []

exports.handler = async (req, res) => {
  try {
    const result = await create('campaigns', req.body)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
