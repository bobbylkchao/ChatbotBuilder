import React, { useState, useEffect } from "react"
import { Table, Space, Popover, Popconfirm, Button, Form, Input } from "antd"
import type { TableProps, FormProps, FormInstance } from "antd"
import { EditOutlined, CloseOutlined, PlusOutlined, LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { useGlobalStateContext } from "../../context/global-state"
import { Container, ButtonContainer } from "./styled"
import { IBotQuickAction } from "../../context/type"
import { Divider } from "../divider"
import { toast } from 'react-hot-toast'
import { themeConfig } from "../../theme/config"
import { LoadingContiner } from "../loading-component"
import { createQuickActionQuery } from "../../misc/apollo-queries/create-quick-action"
import Modal from "../modal"
import { gaSendClickEvent } from "../../misc/google-analytics"

interface IBotQuickActionProps {
  quickAction?: IBotQuickAction
  botId: string
  toggleTipsModal: () => void
}

interface IQuickActionFormat {
  key: number
  displayName: string
  prompt: string
}

const BotQuickAction = ({ botId, quickAction, toggleTipsModal }: IBotQuickActionProps) => {
  const [dataSource, setDataSource] = useState<IQuickActionFormat[] | []>([])
  const [currentQuickAction, setCurrentQuickAction] = useState<IQuickActionFormat | {}>({})
  const [modalTitle, setModalTitle] = useState<'Create' | 'Update'>('Create')
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState<boolean>(false)
  const { setUser } = useGlobalStateContext()
  const [
    submitCreateQuickActionHandler,
    {
      data: submitCreateQuickActionHandlerResult,
      loading: submitCreateQuickActionHandlerLoading,
      error: submitCreateQuickActionHandlerError,
    }
  ] = useMutation(createQuickActionQuery)
  const [form] = Form.useForm()

  // form hook
  const formDisplayName: string = Form.useWatch('displayName', form)
  const formPrompt: string = Form.useWatch('prompt', form)

  const columns: TableProps<IQuickActionFormat>['columns'] = [
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popover content="Edit Quick Action">
            <EditOutlined
              onClick={() => {
                form.resetFields()
                form.setFieldsValue({
                  'displayName': record.displayName,
                  'prompt': record.prompt,
                })
                setCurrentQuickAction({
                  displayName: record.displayName,
                  prompt: record.prompt,
                  key: record.key,
                })
                setIsQuickActionModalOpen(true)
                setModalTitle('Update')
              }}
            />
          </Popover>
          <Popconfirm
            title="Delete Quick Action"
            description="Are you sure to delete this quick action?"
            onConfirm={async (): Promise<void> => {
              await onDelete(record.key)
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

  const onSubmit = async () => {
    form.validateFields()
      .then(async () => {
        let newData: IQuickActionFormat[]
        if ('key' in currentQuickAction) {
          // update
          newData = dataSource.map(data => {
            if (data.key === currentQuickAction.key) {
              return {
                ...data,
                displayName: formDisplayName,
                prompt: formPrompt
              }
            }
            return data
          })
        } else {
          // create
          newData = [...dataSource, {
            key: new Date().getTime(),
            displayName: formDisplayName,
            prompt: formPrompt,
          }]
        }

        try {
          await submitCreateQuickActionHandler({
            variables: {
              botId,
              config: JSON.stringify(newData),
            },
          })
          setDataSource(newData)
        } catch (err: any) {
          const errorMessage = err?.graphQLErrors?.[0]?.message || 
            err?.networkError?.message || 
            `${modalTitle} quick action failed!`
          toast.error(errorMessage)
        }
      })
      .catch(err => {
        toast.error('Form validate failed')
      })
  }

  const onDelete = async (key: number): Promise<void> => {
    const newData = dataSource.filter(data => data.key !== key)
    try {
      await submitCreateQuickActionHandler({
        variables: {
          botId,
          config: JSON.stringify(newData),
        },
      })
      setDataSource(newData)
    } catch (err: any) {
      const errorMessage = err?.graphQLErrors?.[0]?.message || 
        err?.networkError?.message || 
        'Delete quick action failed!'
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    const parseQuickActions = (input: string) => {
      try {
        const parsedQuickActions: IQuickActionFormat[] = JSON.parse(input)
        if (parsedQuickActions && parsedQuickActions.length > 0) {
          parsedQuickActions.forEach((item, index) => {
            item.key = index
          })
          setDataSource(parsedQuickActions)
        }
      } catch (err) {
        console.error('Quick action parse failed', err)
      }
    }

    if (quickAction?.config) {
      parseQuickActions(quickAction.config)
    } else if (quickAction) {
      parseQuickActions(quickAction as unknown as string)
    }
  }, [quickAction])

  useEffect(() => {
    if (submitCreateQuickActionHandlerResult) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser
        return {
          ...prevUser,
          userBots: prevUser.userBots?.map((bot) =>
            bot.id === botId
              ? {
                  ...bot,
                  botQuickActions: submitCreateQuickActionHandlerResult.createQuickAction.config,
                }
              : bot
          ),
        }
      })
      setIsQuickActionModalOpen(false)
      toast.success(`${modalTitle} quick action successfully!`)
    }
  }, [submitCreateQuickActionHandlerResult])

  return (
    <Container>
      {
        submitCreateQuickActionHandlerLoading && <LoadingContiner><LoadingOutlined /></LoadingContiner>
      }
      <ButtonContainer>
        <Button
          type='primary'
          htmlType='submit'
          style={{
            backgroundColor: themeConfig.primary,
            fontSize: 14,
          }}
          onClick={() => {
            form.resetFields()
            form.setFieldsValue({
              'displayName': '',
              'prompt': '',
            })
            setCurrentQuickAction({})
            setIsQuickActionModalOpen(true)
            setModalTitle('Create')
            gaSendClickEvent('button', 'Create New Quick Action')
          }}
          size='small'
        >
          <PlusOutlined /> Create New Quick Action
        </Button>
      </ButtonContainer>
      <Divider />
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{
          width: '100%'
        }}
      />
      <Modal
        title={`${modalTitle} Quick Action`}
        isModalOpen={isQuickActionModalOpen}
        handleCancel={() => setIsQuickActionModalOpen(false)}
        handleOk={async () => await onSubmit()}
        disableCancelButton={false}
      >
        <Form
          name='quick-action-form'
          initialValues={currentQuickAction}
          autoComplete='off'
          layout='vertical'
          style={{
            marginTop: 10,
            width: '100%',
          }}
          form={form}
        >
          <Form.Item
            label={(
              <span>
                <b>Display Name </b>
                <QuestionCircleOutlined onClick={() => {
                  toggleTipsModal()
                }} title="Tips"/>
              </span>
            )}
            name='displayName'
            rules={[{ required: true, message: 'Please input display name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={(
              <span>
                <b>Prompt </b>
                <QuestionCircleOutlined onClick={() => {
                  toggleTipsModal()
                }} title="Tips"/>
              </span>
            )}
            name='prompt'
            rules={[{ required: true, message: 'Please input prompt!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  )
}

export default BotQuickAction
