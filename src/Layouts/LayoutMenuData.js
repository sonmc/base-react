import React from 'react';

const Navdata = () => {
    const menuItems = [
        {
            id: 'workspace',
            public: false,
            group: '[1]',
            label: 'Công ty',
            icon: 'ri-home-heart-line',
            link: '/workspaces',
            click: function (e) {
                e.preventDefault();
            },
        },
        {
            id: 'department',
            public: false,
            group: '[2]',
            label: 'Phòng ban',
            icon: 'ri-building-4-line',
            link: '/departments',
            click: function (e) {
                e.preventDefault();
            },
        },
        {
            id: 'task',
            public: false,
            group: '[2,3,10]',
            label: 'Công việc',
            icon: 'ri-projector-line',
            link: '/tasks',
            click: function (e) {
                e.preventDefault();
            },
        },
        {
            id: 'user',
            public: false,
            group: '[1,2]',
            label: 'Người dùng',
            icon: 'ri-user-line',
            link: '/users',
            click: function (e) {
                e.preventDefault();
            },
        },
        {
            id: 'report',
            public: false,
            group: '[2,3]',
            label: 'Thống kê',
            icon: 'ri-file-list-3-line',
            link: '/reports',
            click: function (e) {
                e.preventDefault();
            },
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
