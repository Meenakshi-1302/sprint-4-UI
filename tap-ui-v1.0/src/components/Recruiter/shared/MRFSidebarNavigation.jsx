import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'

export const MRFDASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/recruiterdashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'Recruitment Process',
		label: 'Recruitment Process',
		path: '/mrfone/level',
		icon: <HiOutlineCube />
	},
	{
		key: 'approver',
		label: 'Approver',
		path: 'approver',
		icon: <HiOutlineShoppingCart />
	},
	
]

export const MRFDASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'Settings',
		label: 'Settings',
		path: '/Settings',
		icon: <HiOutlineQuestionMarkCircle />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]