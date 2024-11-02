import {
  DashboardOutlined,
  MessageOutlined,
  OpenAIOutlined,
  BulbOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

export const navigationConfig = [
  {
    title: 'Dashboard',
    icon: DashboardOutlined,
    pageName: '/dashboard',
  },
  {
    title: 'Bot',
    icon: MessageOutlined,
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
    title: 'Logout',
    icon: LogoutOutlined,
    pageName: '',
  }
]
