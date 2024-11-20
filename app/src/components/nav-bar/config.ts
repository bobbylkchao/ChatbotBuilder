import {
  DashboardOutlined,
  MessageOutlined,
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
    title: 'Playground',
    icon: MessageOutlined,
    pageName: '/playground',
  },
  {
    title: 'Logout',
    icon: LogoutOutlined,
    pageName: '',
  },
]
