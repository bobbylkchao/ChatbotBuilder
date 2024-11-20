import React, { useState, useEffect, useRef } from 'react'
import { Table, Space, Button, Popconfirm, Tour, Tooltip } from 'antd'
import { PlusOutlined, SettingOutlined, CloseOutlined, LoadingOutlined, ExportOutlined } from '@ant-design/icons'
import type { TableProps, TourProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useGlobalStateContext } from '../../context/global-state'
import { convertToLocalTime } from '../../misc/convert-to-local-time'
import { themeConfig } from '../../theme/config'
import { Container, ButtonContainer } from './styled'
import { HeaderH2 } from '../header/styled'
import { Divider } from '../divider'
import Modal from '../modal'
import BotForm, { IBotFormRef } from '../bot-details/bot-form'
import { deleteBotQuery } from '../../misc/apollo-queries/delete-bot'
import { LoadingContiner } from '../loading-component'
import { toast } from 'react-hot-toast'
import { gaSendClickEvent } from '../../misc/google-analytics'

interface IDataType {
  key: string
  id: string
  botName: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

const BotList = (): React.ReactElement => {
  const [dataSource, setDataSource] = useState<IDataType[] | []>([])
  const [isCreateBotModalOpen, setIsCreateBotModalOpen] = useState<boolean>(false)
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false)
  const { user, setUser } = useGlobalStateContext()
  const navigate = useNavigate()
  const botFormRef = useRef<IBotFormRef | null>(null)
  const tourRefBotName = useRef(null)
  const tourRefCreateBot = useRef(null)
  const tourRefPublicUrl = useRef(null)
  const [
    submitDeleteBotHandler,
    {
      data: submitDeleteBotHandlerResult,
      loading: submitDeleteBotHandlerLoading,
    }
  ] = useMutation(deleteBotQuery)

  useEffect(() => {
    if (user?.userBots && user.userBots.length > 0) {
      const botList: IDataType[] = []
      user?.userBots?.map(bot => {
        botList.push({
          key: bot.id,
          id: bot.id,
          botName: bot.name,
          createdBy: user.email,
          createdAt: convertToLocalTime(bot.createdAt),
          updatedAt: convertToLocalTime(bot.updatedAt),
        })
      })
      setDataSource(botList)

      if (!localStorage.getItem('isBotListTourCompleted')) {
        setIsTourOpen(true)
        localStorage.setItem('isBotListTourCompleted', '1')
      }
    }

    if (user?.userBots && user.userBots.length === 0) {
      setDataSource([])
    }
  }, [user])
  
  const onDeleteBot = async (botId: string) => {
    try {
      await submitDeleteBotHandler({
        variables: {
          botId,
        },
      })
    } catch (err: any) {
      const errorMessage = err?.graphQLErrors?.[0]?.message || 
        err?.networkError?.message || 
        'Bot delete failed!'
      toast.error(errorMessage)
    }
  }

  const tourSteps: TourProps['steps'] = [
    {
      title: 'Example Chatbot',
      description: 'This is an example chatbot with everything included, you can use this as a reference.',
      target: () => tourRefBotName.current,
    },
    {
      title: 'Public URL',
      description: 'Click and open your chatbot in new tab and copy public url. Then you can make your chatbot available to your users in other places, such as embedding it in your web or app.',
      target: () => tourRefPublicUrl.current,
    },
    {
      title: 'Create Chatbot',
      description: 'Create your own new chatbots.',
      target: () => tourRefCreateBot.current,
    },
  ]
  
  const columns: TableProps<IDataType>['columns'] = [
    {
      title: 'Bot Name',
      dataIndex: 'botName',
      key: 'botName',
      render: (_, record) => (
        <span
          ref={tourRefBotName}
        >{ record.botName }</span>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Public URL',
      dataIndex: 'publicUrl',
      key: 'publicUrl',
      render: (_, record) => (
        <Tooltip
          placement="top"
          title={<p>Open chatbot in new tab and copy public url</p>}
        >
          <a
            href={`/chat/${record.id}`}
            target='_blank'
            ref={tourRefPublicUrl} rel="noreferrer"
          ><ExportOutlined /></a>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            placement="top"
            title={<p>Configure chatbot</p>}
          >
            <SettingOutlined
                onClick={() => {
                  navigate(`/bot/${record.id}`)
                  gaSendClickEvent('button', 'Configure Bot')
                }}
              />
          </Tooltip>
          <Popconfirm
            title="Delete bot"
            description="Are you sure to delete this bot?"
            onConfirm={async (): Promise<void> => {
              await onDeleteBot(record.id)
              gaSendClickEvent('button', 'Delete Bot')
            }}
            okText="Yes"
            cancelText="No"
            key="delete"
          >
            <CloseOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    if (submitDeleteBotHandlerResult) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser
        return {
          ...prevUser,
          userBots: prevUser.userBots?.filter((bot) => bot.id !== submitDeleteBotHandlerResult.deleteBot),
        }
      })
      toast.success('Bot has been deleted!')
    }
  }, [submitDeleteBotHandlerResult])

  return (
    <Container>
      { submitDeleteBotHandlerLoading && <LoadingContiner><LoadingOutlined /></LoadingContiner> }
      <HeaderH2 style={{
        fontWeight: 'bold',
        color: themeConfig.textColor.lighter,
      }}>Bot List</HeaderH2>
      <Divider />
      <ButtonContainer>
        <Button
          ref={tourRefCreateBot}
          type='primary'
          htmlType='submit'
          style={{
            backgroundColor: themeConfig.primary,
            fontSize: 14,
          }}
          onClick={() => {
            setIsCreateBotModalOpen(true)
            setTimeout(() => {
              if (botFormRef.current) {
                botFormRef.current.getForm().resetFields()
              }
            }, 100)
            gaSendClickEvent('button', 'Create New Bot')
          }}
          size='small'
        >
          <PlusOutlined /> Create New Bot
        </Button>
      </ButtonContainer>
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          style={{
            width: '100%'
          }}
        />
      </div>

      <Modal
        title='Create New Bot'
        isModalOpen={isCreateBotModalOpen}
        handleCancel={() => setIsCreateBotModalOpen(false)}
        handleOk={async () => await botFormRef.current?.onSubmit()}
      >
        <BotForm
          ref={botFormRef}
          extraProps={{
            closeModal: () => setIsCreateBotModalOpen(false),
          }}
        />
      </Modal>

      <Tour open={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
    </Container>
  )
}

export default BotList
