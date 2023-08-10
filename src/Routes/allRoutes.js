import React from 'react';
import { Redirect } from 'react-router-dom';
import Login from '../pages/Authentication/Login';
import UserPage from '../pages/Users';
import DepartmentPage from '../pages/Departments';
import WorkspacePage from '../pages/Workspaces';
import RolePage from '../pages/Roles';
import TaskPage from '../pages/Tasks/TaskList';
import ReportPage from '../pages/Reports';
import ChangePasswordPage from '../pages/ChangePassword';
const authProtectedRoutes = [
    { path: '/workspaces', component: WorkspacePage },
    { path: '/departments', component: DepartmentPage },
    { path: '/tasks', component: TaskPage },
    { path: '/users', component: UserPage },
    { path: '/roles', component: RolePage },
    { path: '/reports', component: ReportPage },
    { path: '/change-password', component: ChangePasswordPage },
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/tasks" />,
    },
];

const publicRoutes = [{ path: '/login', component: Login }];

export { authProtectedRoutes, publicRoutes };
