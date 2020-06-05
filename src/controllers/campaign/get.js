
const { findOne } = require('../../database/abstract')

exports.path = '/campaign'
exports.method = 'GET'

exports.middlewares = []

exports.handler = async (req, res) => {
  try {
    const { stage, campaign } = req.query
    const result = await findOne('campaigns', { stage: parseInt(stage), campaign: campaign })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
