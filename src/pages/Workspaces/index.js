import React, { useEffect, useState } from 'react';
import { CardBody, Col, Container, Table, Button } from 'reactstrap';
import MetaTags from 'react-meta-tags';
import ModalUpdate from './FormUpdate';
import { Get as GetWorkspace, Create } from 'src/Services/workspace.service';
import { Get as GetUser } from 'src/Services/user.service';
import ConfirmModal from 'src/Components/Common/ConfirmModal';
import Empty from 'src/Components/Common/Empty';

const WorkspacePage = () => {
    const [users, setUsers] = useState([]);
    const [workspaceId, setWorkspaceId] = useState(0);
    const [dataConfirm, setDataConfirm] = useState({});
    const [workspaces, setWorkspaces] = useState([]);
    const [filter, setFilter] = useState({
        searchTerm: '',
        roleId: 0,
        status_level: 0,
        status: 0,
    });
    const [isShowFormUpdate, setShowFormUpdate] = useState(false);

    const fetchWorkspace = (filter) => {
        GetWorkspace(filter).then((res) => {
            const workspaceList = [];
            res.forEach((w) => {
                if (w.description.length > 180) {
                    w.shortDes = w.description.substring(0, 180) + '...';
                    w.textDesTitleAction = ' Xem thêm';
                    w.isCuted = true;
                } else {
                    w.shortDes = w.description;
                    w.textDesTitleAction = ' Thu gọn';
                    w.isCuted = false;
                }
                workspaceList.push(w);
            });
            setWorkspaces(workspaceList);
        });
    };

    const fetchUser = (filter) => {
        GetUser(filter).then((res) => {
            setUsers(res);
        });
    };

    const showFormUpdate = (id) => {
        setWorkspaceId(id);
        setShowFormUpdate(!isShowFormUpdate);
    };

    const closeFormUpdate = () => {
        setShowFormUpdate(false);
    };

    const save = (w) => {
        return Create(w)
            .then((res) => {
                if (w?.id) {
                    setWorkspaces((wp) => {
                        return wp.map((x) => {
                            if (x.id !== res.id) return x;
                            if (res.description.length > 180) {
                                res.shortDes = w.description.substring(0, 180) + '...';
                                res.textDesTitleAction = ' Xem thêm';
                                res.isCuted = true;
                            } else {
                                res.shortDes = w.description;
                                res.textDesTitleAction = ' Thu gọn';
                                res.isCuted = false;
                            }
                            return res;
                        });
                    });
                } else {
                    if (res.description.length > 180) {
                        res.shortDes = w.description.substring(0, 180) + '...';
                        res.textDesTitleAction = ' Xem thêm';
                        res.isCuted = true;
                    } else {
                        res.shortDes = w.description;
                        res.textDesTitleAction = ' Thu gọn';
                        res.isCuted = false;
                    }
                    setWorkspaces([...workspaces, res]);
                }
                setShowFormUpdate(false);
            })
            .catch((error) => {});
    };

    const closeConfirm = () => {
        setDataConfirm({ isOpen: false });
    };

    const onConfirmClick = (value) => {
        save({ ...value.employee, status: value.status }).then((x) => {
            closeConfirm();
        });
    };
    const showMore = (w) => {
        let newWorkspaces = [];
        if (w.shortDes.length == w.description.length) {
            newWorkspaces = workspaces.map((workspace) => {
                if (workspace.id == w.id) {
                    w.shortDes = w.description.substring(0, 180) + '...';
                    w.textDesTitleAction = 'Xem thêm';
                    return w;
                }
                return workspace;
            });
        } else {
            newWorkspaces = workspaces.map((wp) => {
                if (w.id == wp.id) {
                    wp.textDesTitleAction = 'Thu gọn';
                    wp.shortDes = w.description;
                }
                return wp;
            });
        }
        setWorkspaces(newWorkspaces);
    };
    useEffect(() => {
        fetchWorkspace(filter);
    }, [filter]);

    useEffect(() => {
        fetchUser();
    }, []);
 
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
                                        <h5 className="card-title mb-0 flex-grow-1">Danh sách công ty</h5>
                                        <div className="flex-shrink-0">
                                            <button className="btn btn-success" onClick={() => showFormUpdate()}>
                                                Thêm mới
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <CardBody>
                                    <div className="mt-3">
                                        <Table className="table-hover table-bordered">
                                            <thead className="tbl-header-custom">
                                                <tr>
                                                    <th style={{ width: '5%' }}>STT</th>
                                                    <th>Tên công ty</th>
                                                    <th>Người quản trị</th>
                                                    <th style={{ width: '33%' }}>Mô tả</th>
                                                    <th style={{ width: '10%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workspaces.map((w, key) => {
                                                    const user = w.users && w.users.length > 0 ? w.users.find((x) => x.is_owner) : null;
                                                    const full_name = user ? user.full_name : '';
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>{w.title}</td>
                                                            <td>{full_name}</td>
                                                            <td>
                                                                {w.shortDes || w.description}
                                                                {w.isCuted && (
                                                                    <button type="button" style={{ color: '#3577f1' }} className="btn btn-link" onClick={() => showMore(w)}>
                                                                        {w.textDesTitleAction}
                                                                    </button>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div className="button-container">
                                                                    <Button className="primary btn-sm" onClick={() => showFormUpdate(w.id)}>
                                                                        Chỉnh sửa
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                        <Empty data={workspaces.length} height={50} text={'Không có dữ liệu !'} />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </div>
                    <ModalUpdate save={save} isShowFormUpdate={isShowFormUpdate} closeFormUpdate={closeFormUpdate} workspaceId={workspaceId} users={users} />
                </Container>
            </div>
            <ConfirmModal data={dataConfirm} onConfirmClick={onConfirmClick} onCloseClick={closeConfirm} />
        </React.Fragment>
    );
};

export default WorkspacePage;
