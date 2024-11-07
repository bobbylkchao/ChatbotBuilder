import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import {
  BotSelectContainer,
  BotSelectDropDownWrapper,
  BotSelect,
} from './styled'

interface IBotSelectDropDown {
  callback: Dispatch<SetStateAction<string>>
}

const BotSelectDropDown = ({ callback }: IBotSelectDropDown): React.ReactElement => {
  const { user } = useGlobalStateContext()
  const [selectedBot, setSelectedBot] = useState<string>('')
  const userBotsList = (user?.userBots && user?.userBots?.length > 0) ? user.userBots : []

  return (
    <BotSelectContainer>
      <BotSelectDropDownWrapper>
        <BotSelect defaultValue={selectedBot} onChange={(v) => {
          setSelectedBot(v.target.value)
          callback(v.target.value)
        }}>
          <option value='' disabled>Choose your bot</option>
          {userBotsList.map(userBot => {
            return (
              <option
                key={userBot.id}
                value={userBot.id}
              >
                { userBot.name }
              </option>
            )
          })}
        </BotSelect>
      </BotSelectDropDownWrapper>
    </BotSelectContainer>
  )
}

export default BotSelectDropDown
