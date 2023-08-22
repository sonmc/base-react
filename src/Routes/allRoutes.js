import Login from 'pages/authentication/Login';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'components/Loadable';
import { lazy } from 'react';

const DashboardPage = Loadable(lazy(() => import('pages/dashboard')));

const authProtectedRoutes = [
  { path: '/dashbard', component: DashboardPage },
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashbard" />
  }
];

const publicRoutes = [{ path: '/login', component: Login }];

export { authProtectedRoutes, publicRoutes };
