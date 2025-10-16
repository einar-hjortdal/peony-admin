import { lazy } from '@dark-engine/core'

import Layout from './layout'
import NoLayout from './layout/NoLayout'

export const routes = [
  {
    path: 'login',
    component: lazy(() => import('./pages/Login'))
  },
  {
    path: '',
    component: Layout,
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
        component: NoLayout,
        children: [
          {
            path: '',
            component: lazy(() => import('./pages/Products'))
          },
          {
            path: 'new',
            component: lazy(() => import('./pages/Products/New'))
          },
          {
            path: ':id',
            component: lazy(() => import('./pages/Products/Product'))
          },
          {
            path: 'categories',
            component: lazy(() => import('./pages/Categories'))
          }
        ]
      },
      {
        path: 'settings',
        component: NoLayout,
        children: [
          {
            path: '',
            component: lazy(() => import('./pages/Settings'))
          },
          {
            path: 'regions',
            component: lazy(() => import('./pages/Regions'))
          },
          {
            path: 'store',
            component: lazy(() => import('./pages/Store'))
          }
        ]
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
