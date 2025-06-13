import { lazy } from '@dark-engine/core'

import Root from './layout/Root'

export const routes = [
  {
    path: 'login',
    component: lazy(() => import('./pages/Login'))
  },
  {
    path: '',
    component: Root,
    children: [
      {
        path: '',
        redirectTo: 'orders'
      },
      {
        path: 'orders',
        component: lazy(() => import('./pages/Orders'))
      },
      {
        path: 'products',
        component: lazy(() => import('./pages/Products'))
      },
      {
        path: 'not-found',
        component: lazy(() => import('./pages/NotFound'))
      },
      {
        path: '**',
        redirectTo: 'not-found'
      }
    ]
  }
]
