const Promise = require('bluebird')
const slackActions = require('./actions')

const actionPreprocessor = async (req, res) => {
  const { type, actions } = JSON.parse(req.body.payload)

  if( type !== 'interactive_message' ) {
    return res.status(403).send(`unsupported action type: ${type}`)
  }

  let actionsProcessed = []

  let promises = actions.map( async action => {
    let actionProcessor = slackActions[action.name]
    let response = await actionProcessor(req, res, action)

    actionsProcessed.push({
      action,
      response
    })
  })

  Promise.all(promises)

  res.status(200).send()
}

module.exports = {
  actionPreprocessor
}