
const { rulesFormsCampaingBody } = require('./case')

const { findOneAndUpdate } = require('../../database/abstract')

exports.path = '/form'
exports.method = 'POST'

exports.middlewares = []

exports.handler = async (req, res) => {
  try {
    const { bodyTratment, bodyKeysUnique, campaign } = await rulesFormsCampaingBody(req.body)
    let query = {}
    query = bodyKeysUnique || bodyTratment
    await findOneAndUpdate('forms', { ...query }, { $set: { ...bodyTratment } }, { returnNewDocument: true, upsert: true })
    res.status(200).json(campaign)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
