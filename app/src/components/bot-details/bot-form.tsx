import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useParams } from 'react-router-dom'
import type { FormProps, FormInstance } from 'antd'
import { Checkbox, Form, Input, Radio, Button, Divider } from 'antd'
import { QuestionCircleOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { updateBotQuery } from '../../misc/apollo-queries/update-bot'
import { createBotQuery } from '../../misc/apollo-queries/create-bot'
import { IUserBots } from '../../context/type'
import { useGlobalStateContext } from '../../context/global-state'
import { themeConfig } from '../../theme/config'
import Modal from '../modal'
import { Container } from './styled'
import { toast } from 'react-hot-toast'
import { LoadingContiner } from '../loading-component'
import { sanitizeInput } from '../../misc/sanitize-input'

interface IBotForm {
  botData?: IUserBots
  extraProps?: {
    [key: string]: any
  }
}

export interface IBotFormRef {
  onSubmit: () => Promise<void>,
  getForm: () => FormInstance<any>,
}

const BotForm = forwardRef<IBotFormRef, IBotForm>(({ botData, extraProps }, ref) => {
  const { setUser } = useGlobalStateContext()
  const [form] = Form.useForm()
  const [isGreetingMessageModalOpen, setIsGreetingMessageModalOpen] = useState<boolean>(false)
  const [isGlobalGuidelinesModalOpen, setIsGlobalGuidelinesModalOpen] = useState<boolean>(false)
  const [isAllowedOriginModalOpen, setIsAllowedOriginModalOpen] = useState<boolean>(false)
  const [
    submitUpdateBotHandler,
    {
      data: submitUpdateBotHandlerResult,
      loading: submitUpdateBotHandlerLoading,
      error: submitUpdateBotHandlerError,
    }
  ] = useMutation(updateBotQuery)
  const [
    submitCreateBotHandler,
    {
      data: submitCreateBotHandlerResult,
      loading: submitCreateBotHandlerLoading,
      error: submitCreateBotHandlerError,
    }
  ] = useMutation(createBotQuery)

  // Form hook
  const formBotName: string = Form.useWatch('name', form)
  const formGreetingMessage: string = Form.useWatch('greetingMessage', form)
  const formGuidelines: string = Form.useWatch('guidelines', form)
  const formAllowedOrigin: string = Form.useWatch('allowedOrigin', form)

  const onSubmit = async (): Promise<void> => {
    form.validateFields()
      .then(async () => {
        try {
          if (botData?.id) {
            // Update bot
            await submitUpdateBotHandler({
              variables: {
                botId: botData.id,
                botName: formBotName,
                greetingMessage: formGreetingMessage,
                guidelines: formGuidelines,
                allowedOrigin:  formAllowedOrigin ? formAllowedOrigin.split(',') : [],
              },
            })
          } else {
            // Create bot
            await submitCreateBotHandler({
              variables: {
                botName: formBotName,
                greetingMessage: formGreetingMessage,
                guidelines: formGuidelines,
                allowedOrigin: formAllowedOrigin ? formAllowedOrigin.split(',') : [],
              },
            })
          }
        } catch (err: any) {
          console.error(err)
          const errorMessage = err?.graphQLErrors?.[0]?.message || 
            err?.networkError?.message || 
            `Bot ${botData?.id ? 'update' : 'create' } failed!`
          toast.error(errorMessage)
        }
      })
      .catch(err => {
        toast.error('Form validate failed')
      })
  }

  useEffect(() => {
    if (submitUpdateBotHandlerResult || submitCreateBotHandlerResult) {
      if (botData?.id) {
        // Update bot
        const formatAllowedOrigin = formAllowedOrigin ? formAllowedOrigin.split(',') : []
        setUser((prevUser) => {
          if (!prevUser) return prevUser
          return {
            ...prevUser,
            userBots: prevUser.userBots?.map((bot) =>
              bot.id === botData.id
                ? {
                    ...bot,
                    name: formBotName,
                    guidelines: formGuidelines,
                    greetingMessage: formGreetingMessage,
                    allowedOrigin: formatAllowedOrigin,
                    updatedAt: submitUpdateBotHandlerResult.updateBot.updatedAt,
                  }
                : bot
            ),
          }
        })
        toast.success('Bot updated!')
      } else {
        const formatAllowedOrigin = formAllowedOrigin ? formAllowedOrigin.split(',') : []
        // Create bot
        setUser((prevUser) => {
          if (!prevUser) return prevUser
          return {
            ...prevUser,
            userBots: [
              ...(prevUser.userBots || []),
              {
                id: submitCreateBotHandlerResult.createBot.id,
                name: formBotName,
                guidelines: formGuidelines,
                botIntents: [],
                greetingMessage: formGreetingMessage,
                allowedOrigin: formatAllowedOrigin,
                createdAt: submitCreateBotHandlerResult.createBot.createdAt,
                updatedAt: submitCreateBotHandlerResult.createBot.updatedAt,
              },
            ],
          }
        })
        toast.success('Bot created!')
        extraProps?.closeModal?.()
      }
    }
  }, [
    submitUpdateBotHandlerResult,
    submitCreateBotHandlerResult,
  ])

  useEffect(() => {
    if (botData) {
      if (!botData.allowedOrigin || botData.allowedOrigin?.length === 0) {
        form.setFieldsValue({
          'allowedOrigin': '',
        })
      } else {
        form.setFieldsValue({
          'allowedOrigin': botData.allowedOrigin.join(),
        })
      }
    }
  }, [botData])

  useImperativeHandle(ref, () => ({
    getForm: () => form,
    onSubmit,
  }))

  return (
    <Container>
      {(submitUpdateBotHandlerLoading || submitCreateBotHandlerLoading) && <LoadingContiner><LoadingOutlined /></LoadingContiner>}
      <Form
        name='bot-details-form'
        initialValues={botData}
        autoComplete='off'
        layout='vertical'
        style={{
          marginTop: 10,
          width: '100%',
        }}
        form={form}
      >
        <Form.Item
          label='Bot Id'
          name='id'
          style={{
            display: botData?.id ? 'block' : 'none'
          }}
        >
          <Input disabled={true}/>
        </Form.Item>

        <Form.Item
          label='Bot Name'
          name='name'
          rules={[{
            required: true,
            pattern: /^[\p{L}\p{N}\s\-\(\)]+$/u,
            message: 'Bot name format is incorrect!',
          }]}
        >
          <Input
            placeholder='eg. Farm Chatbot'
          />
        </Form.Item>

        <Form.Item
          label={
            <span>Greeting Message <QuestionCircleOutlined onClick={() => setIsGreetingMessageModalOpen(true)} title="Tips"/></span>
          }
          name='greetingMessage'
          rules={[{ required: true, message: 'Please input greeting message!' }]}
        >
          <Input.TextArea
            placeholder='eg. Hi, I am your AI Assistant.'
          />
        </Form.Item>

        <Form.Item
          label={
            <span>Global Guidelines <QuestionCircleOutlined onClick={() => setIsGlobalGuidelinesModalOpen(true)} title="Tips"/></span>
          }
          name='guidelines'
        >
          <Input.TextArea style={{height: 200}}/>
        </Form.Item>

        <Form.Item
          label={
            <span>Allowed Origins <QuestionCircleOutlined onClick={() => setIsAllowedOriginModalOpen(true)} title="Tips"/></span>
          }
          name='allowedOrigin'
          rules={[{
            pattern: /^(https?:\/\/[a-zA-Z0-9.-]+(:\d+)?)(,\s*https?:\/\/[a-zA-Z0-9.-]+(:\d+)?)*$/,
            message: 'Allowed origins format is incorrect!',
          }]}
        >
          <Input />
        </Form.Item>

        {
          botData?.id && (
            <>
              <Divider />
              <Form.Item
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{
                    backgroundColor: themeConfig.primary,
                    fontSize: 14,
                  }}
                  onClick={onSubmit}
                  size='small'
                >
                  <CheckOutlined /> Update Bot
                </Button>
              </Form.Item>
            </>
          )
        }
      </Form>
      <Modal
        title='Greeting Message'
        isModalOpen={isGreetingMessageModalOpen}
        handleCancel={() => setIsGreetingMessageModalOpen(false)}
        handleOk={() => setIsGreetingMessageModalOpen(false)}
        disableCancelButton={true}
      >
        <p>When the chatbot is first loaded, it will make an interaction with the API to get the greeting message. The API request includes the botId. The API service will retrieve the greeting message configured for this bot from the database based on the botId. So the greeting message will be different for each chatbot.</p>
        <p>An example of greeting message: </p>
        <pre>Hi, my name is Bobby. I'm your travel assistant! How can I help you today?</pre>
      </Modal>

      <Modal
        title='Global Guidelines'
        isModalOpen={isGlobalGuidelinesModalOpen}
        handleCancel={() => setIsGlobalGuidelinesModalOpen(false)}
        handleOk={() => setIsGlobalGuidelinesModalOpen(false)}
        disableCancelButton={true}
      >
        <p>Guidelines provide structured instructions to help the AI respond appropriately and accurately within the specified context. They set clear boundaries, define acceptable response styles, and ensure the AI’s answers are relevant, consistent, and aligned with user expectations. By following these guidelines, the AI can better understand nuances and make informed decisions about tone, content, and the level of detail required in each answer.</p>
        <p>An example of global guidelines: </p>
        <pre>
        1. Your name is Bobby. You work for Happy Farm. You are a farm assistant robot. Your answers should only be farm-related. If the user's question is not farm-related, please politely inform them that you can only answer farm-related questions.<br/>
        2. Happy Farm's website is https://www.test.com, and the company's abbreviation is HF. Happy Farm is a family-owned business specializing in sustainable agriculture and organic produce.<br/>
        3. If someone asks for your name, tell them your name and who you work for.<br/>
        4. You can help answer users' farm-related questions.<br/>
        5. Respond in a warm and friendly customer service tone.
        </pre>
      </Modal>

      <Modal
        title='Allowed Origins'
        isModalOpen={isAllowedOriginModalOpen}
        handleCancel={() => setIsAllowedOriginModalOpen(false)}
        handleOk={() => setIsAllowedOriginModalOpen(false)}
        disableCancelButton={true}
      >
        <p>This <b>Allowed Origins</b> setting is typically used when embedding your chatbot into other apps or websites, such as via an iframe.</p>
        <p>Configure allowed origins to specify which domains can access your resources. This ensures secure and controlled cross-origin requests.</p>
        <p>This is optional, if not configured, requests from all origins will be allowed to access your chatbot.</p>

        <p><b>Input Format Guidelines</b></p>

        <ul>
          <li>Each domain must start with http:// or https://.</li>
          <li>Use a comma (,) to separate multiple domains.</li>
          <li>Do not include extra trailing commas, or duplicate commas.</li>
        </ul>

        <p><b>Examples</b></p>
        <pre>https://www.example.com</pre>
        <pre>http://www.a.com,https://b.com</pre>
      </Modal>
    </Container>
  )
})

export default BotForm