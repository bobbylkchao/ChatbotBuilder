import {
  DashboardOutlined,
  MessageOutlined,
  OpenAIOutlined,
  BulbOutlined,
  LogoutOutlined,
  RobotOutlined,
} from '@ant-design/icons'

export const navigationConfig = [
  {
    title: 'Dashboard',
    icon: DashboardOutlined,
    pageName: '/dashboard',
  },
  {
    title: 'Bot',
    icon: RobotOutlined,
    pageName: '/bot',
  },
  {
    title: 'Intent',
    icon: OpenAIOutlined,
    pageName: '/intent',
  },
  {
    title: 'Guidelines',
    icon: BulbOutlined,
    pageName: '/guidelines',
  },
  {
    title: 'Playground',
    icon: MessageOutlined,
    pageName: '/playground',
  },
  {
    title: 'Logout',
    icon: LogoutOutlined,
    pageName: '',
  }
]
