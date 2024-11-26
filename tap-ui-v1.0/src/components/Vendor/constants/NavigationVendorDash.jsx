import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiDocumentDuplicate,
    HiOutlineKey,
    HiOutlineCog
} from 'react-icons/hi'
 
 
export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/vendorDashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'products',
        label: 'View MRFs',
        path: 'viewmrfbyvendor',
        icon: <HiDocumentDuplicate />
    },
    {
        key: 'orders',
        label: 'View All Candidates',
        path: 'ViewAllCandidateEveryMRF',
        icon: <HiOutlineUsers />
    },
    {
        key: 'customers',
        label: 'Reset Password',
        path: 'vendorResetPassword',
        icon: <HiOutlineKey />
    }
]
 
export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
   
    {
        key: 'support',
        label: 'Help & Support',
        path: '/support',
        icon: <HiOutlineQuestionMarkCircle />
    }
]