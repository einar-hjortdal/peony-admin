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
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: lazy(() => import('./pages/Dashboard'))
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
