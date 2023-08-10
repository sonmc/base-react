import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import images
import logoSm from 'src/assets/icons/logo.png';
import logoDark from 'src/assets/images/logo.png';
//import Components
import FullScreenDropdown from '../../Components/Common/FullScreenDropdown';
import ProfileDropdown from '../../Components/Common/ProfileDropdown';
import { useDispatch } from 'react-redux';
//redux
import { changeLayout } from '../../store/actions';

const Header = ({ headerClass }) => {
    const [layoutType, setLayoutType] = useState('Vertical');
    const dispatch = useDispatch();

    const changeLayoutType = () => {
        const type = layoutType === 'Vertical' ? 'Horizontal' : 'Vertical';
        setLayoutType(type);
    };

    useEffect(() => {
        dispatch(changeLayout(layoutType));
    }, [layoutType]);

    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize > 767) document.querySelector('.hamburger-icon').classList.toggle('open');

        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
            document.body.classList.contains('menu') ? document.body.classList.remove('menu') : document.body.classList.add('menu');
        }

        //For collapse vertical menu
        if (document.documentElement.getAttribute('data-layout') === 'vertical') {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                document.documentElement.getAttribute('data-sidebar-size') === 'sm' ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                document.documentElement.getAttribute('data-sidebar-size') === 'lg' ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }
    };
    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box horizontal-logo">
                                <div className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="logo" style={{ width: '50%', height: '50%' }} />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="logo" style={{ width: '50%' }} />
                                    </span>
                                </div>

                                <div to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="logo" style={{ width: '50%', height: '50%' }} />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="logo" style={{ width: '50%', height: '50%' }} />
                                    </span>
                                </div>
                            </div>

                            <button onClick={toogleMenuBtn} type="button" className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger" id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>

                        <div className="d-flex align-items-center">
                            {/* <button onClick={() => changeLayoutType()} className="btn btn-ghost-primary">
                                {layoutType === 'Vertical' ? 'Dọc' : 'Ngang'}
                            </button> */}
                            {/* <FullScreenDropdown /> */}
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;