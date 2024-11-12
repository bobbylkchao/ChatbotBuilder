import React, { ReactNode } from 'react'
import { Button, Modal as ModalAntd } from 'antd'
import { ModalContent } from './styled'
import { Divider } from '../divider'
import { themeConfig } from '../../theme/config'

interface IModal {
  title: string
  isModalOpen: boolean
  closable?: boolean
  maskClosable?: boolean
  disableOkButton?: boolean
  disableCancelButton?: boolean
  handleOk?: (e: React.MouseEvent<HTMLButtonElement>) => void
  okText?: string
  cancelText?: string,
  handleCancel?: (e: React.SyntheticEvent) => void
  children: ReactNode | ReactNode[]
  size?: 'normal' | 'lg'
  extraButtons?: ReactNode | ReactNode[]
}

const Modal = ({
  title,
  isModalOpen,
  closable=true,
  maskClosable=true,
  disableOkButton=false,
  disableCancelButton=false,
  cancelText='Cancel',
  okText='OK',
  handleOk,
  handleCancel,
  size='normal',
  extraButtons,
  children
}: IModal): React.ReactElement => {
  return (
    <ModalAntd
      maskClosable={maskClosable}
      centered={true}
      title={title}
      open={isModalOpen}
      closable={closable}
      onCancel={handleCancel}
      cancelText={cancelText}
      footer={[
        !disableCancelButton ? <Button
          key="cancel"
          onClick={handleCancel}
        >
          {cancelText}
        </Button> : null,
        extraButtons ? extraButtons : null,
        !disableOkButton ? <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          style={{backgroundColor: themeConfig.primary}}
        >
          {okText}
        </Button> : null,
      ]}
      width={size === 'lg' ? 1000 : undefined}
    >
      <ModalContent>
        <Divider />
        <div>
          { children }
        </div>
        {!disableOkButton ? <Divider /> : <></>}
      </ModalContent>
    </ModalAntd>
  )
}

export default Modal
