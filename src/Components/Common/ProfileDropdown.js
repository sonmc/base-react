import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Logout } from 'src/Services/auth.service';

import { currentUserAtom } from 'src/Recoil/states/users';
import avatarDefault from 'src/assets/images/default-avatar.png';

const ProfileDropdown = () => {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    const [avatar, setAvatar] = useState(avatarDefault);
    const changePasswordPage = () => {
        history.push('/change-password');
    };

    const logout = () => {
        Logout();
        history.push('/login');
        setCurrentUser(null);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{currentUser.username}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem onClick={() => changePasswordPage()}>
                        <i className="ri-key-2-line text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Đổi mật khẩu</span>
                    </DropdownItem>
                    <DropdownItem onClick={logout}>
                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle" data-key="t-logout">
                            Đăng xuất
                        </span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
