import React, { useState, useEffect, useRef, useCallback } from "react"
import { Table, Space, Checkbox, Button, Popconfirm } from "antd"
import type { TableProps, PopconfirmProps } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import toast from 'react-hot-toast'
import { IBotIntents } from "../../context/type"
import { useGlobalStateContext } from "../../context/global-state"
import { convertToLocalTime } from "../../misc/convert-to-local-time"
import { Dot } from "../dot/styled"
import Modal from "../modal"
import IntentDetails, { IIntentDetailsRef } from "../intent-details"
import { themeConfig } from "../../theme/config"
import { ButtonContainer } from "./styled"

interface IBotIntentListProps {
  botId: string
}

const BotIntentList = ({ botId }: IBotIntentListProps): React.ReactElement => {
  const [dataSource, setDataSource] = useState<IBotIntents[] | []>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentIntentId, setCurrentIntentId] = useState<string>('')
  const intentDetailsFormRef = useRef<IIntentDetailsRef | null>(null)
  const { user } = useGlobalStateContext()

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
          }}
          size='small'
        >
          <PlusOutlined /> Create New Intent
        </Button>
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
                console.log('delete')
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
    </>
  )
}

export default BotIntentList
