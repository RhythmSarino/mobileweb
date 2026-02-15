import LoginPage from '@/pages/LoginPage';
import Tab1 from '@/pages/Tab1';
import Tab2 from '@/pages/Tab2';
import Tab3 from '@/pages/Tab3';

/**
 * Route Configuration
 * - path: URL path
 * - component: React component to render
 * - exact: Exact path matching
 */
export const routes = [
  {
    path: '/login',
    component: LoginPage,
    exact: true,
    meta: { requiresAuth: false },
  },
  {
    path: '/tab1',
    component: Tab1,
    exact: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/tab2',
    component: Tab2,
    exact: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/tab3',
    component: Tab3,
    exact: true,
    meta: { requiresAuth: true },
  },
];

export default routes;
