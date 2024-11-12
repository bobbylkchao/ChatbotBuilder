import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Collapse, Button } from 'antd'
import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { IUserBots } from '../../context/type'
import { useGlobalStateContext } from '../../context/global-state'
import BotNotFound from './bot-not-found'
import { themeConfig } from '../../theme/config'
import { Divider } from '../divider'
import { HeaderH2 } from '../header/styled'
import BotForm from './bot-form'
import BotIntentList from '../bot-intent-list'

const BotDetails = (): React.ReactElement => {
  const { botId = '' } = useParams()
  const { user } = useGlobalStateContext()
  const [currentBot, setCurrentBot] = useState<IUserBots | null | 'loading'>('loading')

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
          label: <b>Bot Intent Configurations</b>,
          children: <BotIntentList botId={currentBot.id}/>,
        }]}
        defaultActiveKey={['botIntentConfigurations']}
        style={{
          width: '100%',
          marginTop: '10px',
        }}
      />
    </>
  )
}

export default BotDetails
