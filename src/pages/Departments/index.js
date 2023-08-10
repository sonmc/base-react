import React, { useEffect, useState } from 'react';
import { Button, CardBody, Col, Container, Table } from 'reactstrap';
import MetaTags from 'react-meta-tags';
import ModalUpdate from './UpdateModal';
// import AddMemberModal from './AddMemberModal';
import { Get as GetUser } from 'src/Services/user.service';
import { Get as GetDepartment, Create, AddMember } from 'src/Services/department.service';
import ConfirmModal from 'src/Components/Common/ConfirmModal';
import Empty from 'src/Components/Common/Empty';

const DepartmentPage = () => {
    const [users, setUsers] = useState([]);
    const [departmentId, setDepartmentId] = useState(0);
    const [dataConfirm, setDataConfirm] = useState({});

    const [departments, setDepartments] = useState([]);
    const [filter, setFilter] = useState({
        searchTerm: '',
    });
    const [isShowFormUpdate, setShowFormUpdate] = useState(false);

    const fetchDepartment = (filter) => {
        GetDepartment(filter).then((res) => {
            const departmentList = [];
            res.forEach((w) => {
                if (w.description.length > 100) {
                    w.shortDes = w.description.substring(0, 100) + '...';
                    w.isCuted = true;
                    w.textDesTitleAction = ' Xem thêm';
                } else {
                    w.shortDes = w.description;
                    w.isCuted = false;
                    w.textDesTitleAction = ' Thu gọn';
                }
                departmentList.push(w);
            });
            setDepartments(departmentList);
        });
    };

    const showFormUpdate = (departmentId) => {
        setDepartmentId(departmentId);
        setShowFormUpdate(!isShowFormUpdate);
    };

    const closeFormUpdate = () => {
        setShowFormUpdate(false);
    };

    const save = (department) => {
        delete department.users;
        delete department.admin;
        return Create(department)
            .then((res) => {
                fetchDepartment();
                if (department?.id) {
                    setDepartments((emps) => {
                        return emps.map((x) => {
                            if (x.id !== res.id) return x;
                            return res;
                        });
                    });
                } else {
                    setDepartments([...departments, { ...res, users: [] }]);
                }
                setShowFormUpdate(false);
            })
            .catch((error) => {});
    };

    const addMember = (param) => {
        AddMember(param).then((res) => {});
    };

    const fetchUser = () => {
        GetUser().then((res) => {
            setUsers(res);
        });
    };

    const closeConfirm = () => {
        setDataConfirm({ isOpen: false });
    };

    const onConfirmClick = (value) => {
        save({ ...value.department, status: value.status }).then((x) => {
            closeConfirm();
        });
    };

    const showMore = (w) => {
        let departmentsList = [];
        if (w.shortDes.length == w.description.length) {
            departmentsList = departments.map((department) => {
                if (department.id == w.id) {
                    department.shortDes = w.description.substring(0, 100) + '...';
                    department.textDesTitleAction = ' Xem thêm';
                }
                return department;
            });
        } else {
            departmentsList = departments.map((wp) => {
                if (w.id == wp.id) {
                    wp.shortDes = w.description;
                    wp.textDesTitleAction = ' Thu gọn';
                }
                return wp;
            });
        }
        setDepartments(departmentsList);
    };

    useEffect(() => {
        fetchDepartment(filter);
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
                                        <h5 className="card-title mb-0 flex-grow-1">Danh sách phòng ban</h5>
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
                                                    <th style={{ width: '20%' }}>Tên</th>
                                                    <th style={{ width: '20%' }}>Người quản trị</th>
                                                    <th style={{ width: '20%' }}>Mô tả</th>
                                                    <th style={{ width: '5%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {departments.map((d, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>{d.name}</td>
                                                            <td>{d.admin.full_name}</td>
                                                            <td>
                                                                {d.shortDes || d.description}
                                                                {d.isCuted && (
                                                                    <button style={{ color: '#3577f1' }} className="btn btn-link" onClick={() => showMore(d)}>
                                                                        {d.textDesTitleAction}
                                                                    </button>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div className="button-container">
                                                                    <Button className="primary btn-sm" onClick={() => showFormUpdate(d.id)}>
                                                                        Chỉnh sửa
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                        <Empty data={departments.length} height={50} text={'Không có dữ liệu !'} />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </div>
                    <ModalUpdate
                        save={save}
                        isShowFormUpdate={isShowFormUpdate}
                        closeFormUpdate={closeFormUpdate}
                        departmentId={departmentId}
                        departments={departments.filter((x) => {
                            return x.id !== departmentId;
                        })}
                        addMember={addMember}
                        users={users}
                    />
                </Container>
            </div>
            <ConfirmModal data={dataConfirm} onConfirmClick={onConfirmClick} onCloseClick={closeConfirm} />
        </React.Fragment>
    );
};

export default DepartmentPage;
