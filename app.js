const { App, ExpressReceiver } = require('@slack/bolt')
const serverlessExpress = require('@vendia/serverless-express')

require('dotenv').config()

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
})

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
})

app.message('hello', async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me'
          },
          action_id: 'button_click'
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  })
})

app.action('button_click', async ({ body, ack, say }) => {
  await ack()
  await say(`<@${body.user.id}> clicked the button`)
})
;(async () => {
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()

exports.handler = serverlessExpress({
  app: expressReceiver.app
})
