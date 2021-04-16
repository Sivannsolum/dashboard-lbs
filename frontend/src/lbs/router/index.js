const lbsChildrenRoutes = [
  {
    path: '/Lbs/Management',
    name: 'Management',
    component: () => import('@/lbs/views/Management')
  },
  {
    path: '/Lbs/MapDesign',
    name: 'Map Design',
    component: () => import('@/lbs/views/MapDesign')
  },
  {
    path: '/Lbs/SelfLocationLink',
    name: 'Self Location Link',
    component: () => import('@/lbs/views/SelfLocationLink')
  },
  {
    path: '/Lbs/StockingAndPricing',
    name: 'Stoking And Pricing',
    component: () => import('@/lbs/views/StockingAndPricing')
  },
  {
    path: '/Lbs/Setting',
    name: 'Setting',
    component: () => import('@/lbs/views/Setting')
  }
]

const lbsRoutes = {
  path: '/Lbs',
  component: () => import('@/views/Main'),
  redirect: '/Lbs/Management',
  meta: {
    requiresAuth: true
  },
  children: lbsChildrenRoutes
}
export default lbsRoutes
