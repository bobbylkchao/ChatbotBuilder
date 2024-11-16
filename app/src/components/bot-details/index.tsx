import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Collapse, Button, Space, Switch } from 'antd'
import { PlusOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { IUserBots } from '../../context/type'
import { useGlobalStateContext } from '../../context/global-state'
import BotNotFound from './bot-not-found'
import { themeConfig } from '../../theme/config'
import { Divider } from '../divider'
import { HeaderH2 } from '../header/styled'
import BotForm from './bot-form'
import BotIntentList from '../bot-intent-list'
import BotQuickAction from '../bot-quick-action'
import Modal from '../modal'
import { BotIntentHeaderContainer, BotIntentHeaderLeft } from './styled'

const BotDetails = (): React.ReactElement => {
  const { botId = '' } = useParams()
  const { user } = useGlobalStateContext()
  const [currentBot, setCurrentBot] = useState<IUserBots | null | 'loading'>('loading')
  const [isBotIntentTipsModalOpen, setIsBotIntentTipsModalOpen] = useState<boolean>(false)
  const [isBotQuickActionsTipsModalOpen, setIsBotQuickActionsTipsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const bot = user?.userBots?.find(bot => bot.id === botId) || null
    setCurrentBot(bot)
  }, [botId, user?.userBots])

  if (currentBot === 'loading') {
    return <div>Loading...</div>
  }

  if (!currentBot) {
    return <BotNotFound />
  }

  return (
    <>
      <HeaderH2 style={{
        fontWeight: 'bold',
        color: themeConfig.textColor.lighter,
      }}>Bot Configuration</HeaderH2>
      <Divider />
      <Collapse
        items={[{
          key: 'botInfo',
          label: <b>Bot Info</b>,
          children: <BotForm botData={currentBot}/>,
        }]}
        defaultActiveKey={['botInfo']}
        style={{
          width: '100%',
          marginTop: '10px',
        }}
      />
      <Collapse
        items={[{
          key: 'botIntentConfigurations',
          label: (
            <BotIntentHeaderContainer>
              <BotIntentHeaderLeft>
                <span>
                  <b>Bot Intents </b>
                  <QuestionCircleOutlined onClick={(event) => {
                    event.stopPropagation()
                    setIsBotIntentTipsModalOpen(true)
                  }} title="Tips"/>
                </span>
              </BotIntentHeaderLeft>
            </BotIntentHeaderContainer>
          ),
          children: <BotIntentList botId={currentBot.id}/>,
        }]}
        defaultActiveKey={['botIntentConfigurations']}
        style={{
          width: '100%',
          marginTop: '10px',
        }}
      />
      <Collapse
        items={[{
          key: 'botQuickActionConfigurations',
          label: (
            <span>
              <b>Bot Quick Actions </b>
              <QuestionCircleOutlined onClick={(event) => {
                event.stopPropagation()
                setIsBotQuickActionsTipsModalOpen(true)
              }} title="Tips"/>
            </span>
          ),
          children: <BotQuickAction quickAction={currentBot.botQuickActions} botId={currentBot.id} toggleTipsModal={() => setIsBotQuickActionsTipsModalOpen(!isBotQuickActionsTipsModalOpen)}/>,
        }]}
        defaultActiveKey={['botQuickActionConfigurations']}
        style={{
          width: '100%',
          marginTop: '10px',
        }}
      />
      <Modal
        title='Bot Intent'
        isModalOpen={isBotIntentTipsModalOpen}
        handleCancel={() => setIsBotIntentTipsModalOpen(false)}
        handleOk={() => setIsBotIntentTipsModalOpen(false)}
        disableCancelButton={true}
      >
        <p>
          <b><i>Intent</i></b> is an important part of chatbot. It defines the user's needs and help the chatbot determine how to respond. For example, when a user asks, “What's the weather like in Winnipeg today?”, you can create an intent for it, the intent name could be <i>user_asks_weather</i>.
        </p>
        <p>
          Then you can set an intent handler to handle this intent. In this example, you may want to call the weather API to get the weather data and then return it to the user.
        </p>
      </Modal>
      <Modal
        title='Bot Quick Actions'
        isModalOpen={isBotQuickActionsTipsModalOpen}
        handleCancel={() => setIsBotQuickActionsTipsModalOpen(false)}
        handleOk={() => setIsBotQuickActionsTipsModalOpen(false)}
        disableCancelButton={true}
      >
        <p>Bot Quick Actions are designed to help users, especially first-time users who might not know what to ask, by offering them ideas on how to interact with the chatbot. These actions appear as quick-reply buttons, sent immediately after the greeting message to guide the conversation.</p>

        <p>Each Quick Action includes two parameters:</p>
        <p>1. <b>Display Name</b> - The text shown on the button, which can include emojis to make it visually engaging.</p>
        <p>2. <b>Prompt</b> - The message that will be automatically sent to the chatbot when the button is clicked.</p>

        <p>You can create corresponding intents and intent handlers to process these prompts effectively.</p>
        <p>For example, in a travel chatbot, new users might not know what to ask on their first visit. To address this, you could create Quick Actions such as:</p>

        <ul>
          <li>🏨 Find a hotel</li>
          <li>🗺️ Trip recommendation</li>
          <li>📞 Help with my booking</li>
        </ul>
        
        <p>When a user clicks the "Find a hotel" button, the chatbot automatically sends the message "Find a hotel." You can then handle this request by defining an intent for it (e.g., <i>"user_ask_find_a_hotel"</i>) and implementing the corresponding handler, which might involve calling a hotel search API and returning a list of hotels to the user.</p>
      </Modal>
    </>
  )
}

export default BotDetails
