import React, { useEffect, useState } from 'react';
import { CardBody, Col, Container, Table, Button } from 'reactstrap';
import MetaTags from 'react-meta-tags';
import ModalUpdate from './FormUpdate';
import { Get as GetUser, Create, Update } from 'src/Services/user.service';
import ConfirmModal from 'src/Components/Common/ConfirmModal';
import { currentUserAtom } from '../../Recoil/states/users';
import { useRecoilValue } from 'recoil';
import { ROLE } from '../../Constant';
import Empty from 'src/Components/Common/Empty';
import { Grid, _ } from 'gridjs-react';

const _userPage = () => {
    const currentUser = useRecoilValue(currentUserAtom);
    const [userId, setUserId] = useState(0);
    const [dataConfirm, setDataConfirm] = useState({});
    const [usernameDuplicate, setUsernameDuplicate] = useState('');
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);

    const [filter, setFilter] = useState({
        searchTerm: '',
        roleId: 0,
        status_level: 0,
        status: 0,
    });
    const [isShowFormUpdate, setShowFormUpdate] = useState(false);

    const fetchUser = (filter) => {
        GetUser(filter).then((res) => {
            const newData = res.map((obj, index) => {
                const title = currentUser.group_ids == ROLE.admin_workspace ? obj.department : obj.workspace.title;
                return [obj.id, obj.username, obj.full_name, title, index + 1];
            });
            setData(newData);
            // setUsers(users);
        });
    };

    const showFormUpdate = (userId) => {
        setUserId(userId);
        setUsernameDuplicate('');
        setShowFormUpdate(!isShowFormUpdate);
    };

    const closeFormUpdate = () => {
        setUsernameDuplicate('');
        setShowFormUpdate(false);
    };

    const save = (user) => {
        const param = { ...user };
        if (param.password === '') {
            delete param.password;
        }
        return Create(param)
            .then((res) => {
                if (res.status == 'error' && res.result.username) {
                    setUsernameDuplicate(res.result.username);
                } else {
                    fetchUser();
                    setShowFormUpdate(false);
                    setUsernameDuplicate('success');
                }
            })
            .catch((error) => {});
    };

    const closeConfirm = () => {
        setDataConfirm({ isOpen: false });
    };

    const onConfirmClick = (value) => {
        save({ ...value.user, status: value.status }).then((x) => {
            closeConfirm();
        });
    };

    useEffect(() => {
        fetchUser(filter);
    }, [filter]);

    const gridConfig = {
        language: {
            pagination: {
                previous: 'Trang trước',
                next: 'Trang sau',
            },
        },
    };
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Base core</title>
                </MetaTags>
                <Container fluid>
                    <div className="row">
                        <Col lg={12}>
                            <div className="card" id="tasksList">
                                <div className="card-header pb-0 border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">Danh sách người dùng</h5>
                                        <div className="flex-shrink-0">
                                            <button className="btn btn-success" onClick={() => showFormUpdate()}>
                                                Thêm mới
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <CardBody>
                                    <div className="mt-3">
                                        <Grid
                                            {...gridConfig}
                                            data={data}
                                            columns={[
                                                {
                                                    name: 'STT',
                                                    formatter: (cell, row) => _(<span className="fw-semibold">{row.cells[row.cells.length - 1].data}</span>),
                                                },
                                                'Tên đăng nhập',
                                                {
                                                    name: 'Họ tên',
                                                    formatter: (cell) => _(cell),
                                                },
                                                currentUser.group_ids == ROLE.admin_workspace ? 'Phòng ban' : 'Công ty',
                                                {
                                                    name: '',
                                                    width: '10%',
                                                    formatter: (cell, row) =>
                                                        _(
                                                            <div className="button-container">
                                                                <Button className="primary btn-sm" onClick={() => showFormUpdate(row.cells[0].data)}>
                                                                    Chỉnh sửa
                                                                </Button>
                                                            </div>
                                                        ),
                                                    sort: false,
                                                },
                                            ]}
                                            search={false}
                                            sort={true}
                                            pagination={{ enabled: true, limit: 10 }}
                                            className="custom-grid-bg-white"
                                        />
                                        {/* <Table className="table-hover">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '5%' }}>STT</th>
                                                    <th style={{ width: '20%' }}>Tên đăng nhập</th>
                                                    <th style={{ width: '20%' }}>Họ và tên</th>
                                                    <th style={{ width: '20%' }}>{currentUser.group_ids == ROLE.admin_workspace ? 'Phòng ban' : 'Công ty'}</th>
                                                    <th style={{ width: '5%', paddingRight: 0 }}> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((u, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>{u.username}</td>
                                                            <td>{u.full_name}</td>
                                                            <td>{currentUser.group_ids == ROLE.admin_workspace ? u.department : u.workspace.title}</td>
                                                            <td style={{ paddingRight: 0 }}>
                                                                <Button className="primary btn-sm" onClick={() => showFormUpdate(u.id)}>
                                                                    Chỉnh sửa
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table> */}
                                        <Empty data={data.length} height={50} text={'Không có dữ liệu !'} />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </div>
                    <ModalUpdate save={save} isShowFormUpdate={isShowFormUpdate} closeFormUpdate={closeFormUpdate} userId={userId} usernameDuplicate={usernameDuplicate} />
                </Container>
            </div>
            <ConfirmModal data={dataConfirm} onConfirmClick={onConfirmClick} onCloseClick={closeConfirm} />
        </React.Fragment>
    );
};

export default _userPage;
