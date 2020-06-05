
const { findOne } = require('../../database/abstract')

const validateBody = (object, ...body) => returnObject => {
  body.map(key => {
    if (object[key] !== undefined) returnObject[key] = object[key]
    return returnObject
  })
}

const keysBodyDatabase = (body) => body.map(val => val.name.toLowerCase())
const keysBodyDatabaseUnique = (body) => body.map(val => {
  if (val.unique) return val.name
}).filter(val => val)

exports.rulesFormsCampaingBody = async (body) => {
  try {
    const campaign = await findOne('campaigns', { stage: parseInt(body.stage), campaign: body.campaign })
    if (!campaign) throw new Error('Campaign not found')

    let keys = keysBodyDatabase(campaign.body)

    const keysUnique = keysBodyDatabaseUnique(campaign.body)
    const bodyTratment = {}

    keys = [...keys, 'campaign', 'stage']
    validateBody(body, ...keys)(bodyTratment)

    const bodyKeysUnique = {}

    if (keysUnique.length > 0) validateBody(body, ...keysUnique)(bodyKeysUnique)

    if (Object.keys(bodyTratment).length !== keys.length) throw new Error('Forms invalid!')

    return { bodyTratment, bodyKeysUnique, campaign }
  } catch (error) {
    throw new Error(error.message)
  }
}
