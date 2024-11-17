import React, { useState, useEffect, useRef, useCallback } from "react"
import { Table, Space, Checkbox, Button, Popconfirm, Switch, Tooltip } from "antd"
import type { TableProps, PopconfirmProps } from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import toast from 'react-hot-toast'
import { useMutation } from "@apollo/client"
import { IBotIntents } from "../../context/type"
import { useGlobalStateContext } from "../../context/global-state"
import { convertToLocalTime } from "../../misc/convert-to-local-time"
import { Dot } from "../dot/styled"
import Modal from "../modal"
import IntentDetails, { IIntentDetailsRef } from "../intent-details"
import { themeConfig } from "../../theme/config"
import { ButtonContainer, CreateIntentButtonContainer, StrictIntentDetectionContainer } from "./styled"
import { gaSendClickEvent } from "../../misc/google-analytics"
import { updateBotStrictIntentDetectionQuery } from "../../misc/apollo-queries/update-bot-strict-intent-detection"

interface IBotIntentListProps {
  botId: string
}

const BotIntentList = ({ botId }: IBotIntentListProps): React.ReactElement => {
  const [dataSource, setDataSource] = useState<IBotIntents[] | []>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isStrictIntentDetectionModalOpen, setIsStrictIntentDetectionModalOpen] = useState<boolean>(false)
  const [currentIntentId, setCurrentIntentId] = useState<string>('')
  const intentDetailsFormRef = useRef<IIntentDetailsRef | null>(null)
  const { user, setUser } = useGlobalStateContext()
  const [
    updateBotStrictIntentDetectionHandler,
    {
      data: updateBotStrictIntentDetectionHandlerResult,
      loading: updateBotStrictIntentDetectionHandlerLoading,
      error: updateBotStrictIntentDetectionHandlerError,
    }
  ] = useMutation(updateBotStrictIntentDetectionQuery)

  // Set intent details data when model is opened
  const openIntentDetailsModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  useEffect(() => {
    if (user && intentDetailsFormRef?.current && currentIntentId) {
      const findCurrentIntent = dataSource.find(intent => intent.id === currentIntentId)
      if (findCurrentIntent) {
        intentDetailsFormRef?.current?.setData(findCurrentIntent)
      }
    }
  }, [user, intentDetailsFormRef?.current, currentIntentId])

  useEffect(() => {
    if (user?.userBots && user.userBots.length > 0) {
      user.userBots.map(bot => {
        if (bot.id === botId) {
          const getBotIntents = bot.botIntents
          if (getBotIntents && getBotIntents.length > 0) {
            getBotIntents.map(intent => {
              intent.botId = botId
              intent.key = intent.id
              intent.createdAt = convertToLocalTime(intent.createdAt || '')
              intent.updatedAt = convertToLocalTime(intent.updatedAt || '')
            })
            setDataSource(getBotIntents)
          }
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (updateBotStrictIntentDetectionHandlerResult) {
      const newBotUpdatedAt =
        updateBotStrictIntentDetectionHandlerResult.updateBotStrictIntentDetection.updatedAt
      const newStrictIntentDetection = 
        updateBotStrictIntentDetectionHandlerResult.updateBotStrictIntentDetection.strictIntentDetection
      setUser((prevUser) => {
        if (!prevUser) return prevUser
        return {
          ...prevUser,
          userBots: prevUser.userBots?.map((bot) =>
            bot.id === botId
              ? {
                  ...bot,
                  strictIntentDetection: newStrictIntentDetection,
                  updatedAt: newBotUpdatedAt,
                }
              : bot
          ),
        }
      })
      toast.success('Strict intent detection updated!')
    }
  }, [updateBotStrictIntentDetectionHandlerResult])

  const columns: TableProps<IBotIntents>['columns'] = [
    {
      title: 'Intent Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Intent Handler Type',
      dataIndex: 'intentHandler',
      key: 'intentHandler',
      render: (_, record) => {
        return record?.intentHandler?.type || <span style={{color: 'red'}}>Not configured</span>
      },
    },
    {
      title: 'Required Fields',
      dataIndex: 'requiredFields',
      key: 'requiredFields',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      sorter: (a, b) => Number(a.isEnabled) - Number(b.isEnabled),
      render: (_, record) => {
        return record.isEnabled ? <><Dot color='green' /> Enabled</> : <><Dot color='red' /> Disabled</>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            setCurrentIntentId(record.id || '')
            openIntentDetailsModal()
          }}>Details</a>
        </Space>
      ),
    },
  ]

  return (
    <>
      <ButtonContainer>
        <StrictIntentDetectionContainer>
          <Space direction="horizontal" align="center">
            <span>
              Strict Intent Detection
            </span>
            <Tooltip placement="top" title={<p>When <i><b>strict_intent_detection</b></i> is enabled, if the user's question does not meet any of the intent, the chatbot will not be allowed to answer freely, but will return something like “Sorry I can't answer this question”. Because sometimes we want the chatbot to be controllable and only answer questions with the configured intent.</p>}>
              <Switch
                loading={updateBotStrictIntentDetectionHandlerLoading}
                checkedChildren="Enabled"
                unCheckedChildren="Disabled"
                value={user?.userBots?.find(bot => bot.id === botId)?.strictIntentDetection}
                onClick={(_, event) => event.stopPropagation()}
                onChange={async (value) => {
                  try {
                    await updateBotStrictIntentDetectionHandler({
                      variables: {
                        botId,
                        strictIntentDetection: value,
                      },
                    })
                  } catch (err: any) {
                    console.error(err)
                    const errorMessage = err?.graphQLErrors?.[0]?.message || 
                      err?.networkError?.message || 
                      `Strict intent detection update failed!`
                    toast.error(errorMessage)
                  }
                }}
              />
            </Tooltip>
            <QuestionCircleOutlined onClick={() => setIsStrictIntentDetectionModalOpen(true)} title="Tips" />
          </Space>
        </StrictIntentDetectionContainer>
        <CreateIntentButtonContainer>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              backgroundColor: themeConfig.primary,
              fontSize: 14,
            }}
            onClick={() => {
              setCurrentIntentId('')
              openIntentDetailsModal()
              setTimeout(() => {
                intentDetailsFormRef?.current?.setData({
                  botId,
                  key: undefined,
                  id: undefined,
                  name: undefined,
                  isEnabled: undefined,
                  intentHandler: undefined,
                  createdAt: undefined,
                  updatedAt: undefined,
                  requiredFields: undefined,
                })
              }, 100)
              gaSendClickEvent('button', 'Create New Intent')
            }}
            size='small'
          >
            <PlusOutlined /> Create New Intent
          </Button>
        </CreateIntentButtonContainer>
      </ButtonContainer>
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{
          width: '100vw',
          overflow: 'auto'
        }}
      />

      <Modal
        title='Intent Details'
        isModalOpen={isModalOpen}
        okText='Submit'
        handleCancel={() => setIsModalOpen(false)}
        handleOk={() => intentDetailsFormRef.current?.onSubmit()}
        size='lg'
        maskClosable={false}
        extraButtons={
          currentIntentId ? <Popconfirm
            title="Delete the intent"
            description="Are you sure to delete this intent?"
            onConfirm={async (): Promise<void> => {
              if (intentDetailsFormRef?.current) {
                gaSendClickEvent('button', 'Delete the intent')
                const result = await intentDetailsFormRef.current.onDelete()
                if (result) {
                  setIsModalOpen(false)
                }
              }
            }}
            okText="Yes"
            cancelText="No"
            key="delete"
          >
            <Button danger>Delete</Button>
          </Popconfirm> : undefined
        }
      >
        <IntentDetails ref={intentDetailsFormRef} />
      </Modal>

      <Modal
        title='Strict Intent Detection'
        isModalOpen={isStrictIntentDetectionModalOpen}
        handleCancel={() => setIsStrictIntentDetectionModalOpen(false)}
        handleOk={() => setIsStrictIntentDetectionModalOpen(false)}
        disableCancelButton={true}
      >
        <p>When <i><b>strict_intent_detection</b></i> is enabled, if the user's question does not meet any of the intent, the chatbot will not be allowed to answer freely, but will return something like “Sorry I can't answer this question”. Because sometimes we want the chatbot to be controllable and only answer questions with the configured intent.</p>
      </Modal>
    </>
  )
}

export default BotIntentList
