import React, { useEffect, useState } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, Input, Label, Table, FormFeedback } from 'reactstrap';
import { Get } from 'src/Services/department.service';
import Select from 'react-select';
const DEPARTMENT_DEFAULT = {
    name: '',
    description: '',
    admin_id: '',
};

const ModalUpdate = (props) => {
    const [userSelected, setUserSelected] = useState(null);
    const { isShowFormUpdate, closeFormUpdate, save, departmentId, users, addMember } = props;
    const [userError, setUserError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [department, setDepartment] = useState({ ...DEPARTMENT_DEFAULT });
    const [title, setTitle] = useState('Thêm phòng ban');
    const [idsSelected, setIdsSelected] = useState([]);

    const saveMember = () => {
        const param = {
            departmentId: departmentId,
            ids: idsSelected.filter((item) => item !== userSelected.id),
        };
        addMember(param);
    };

    const update = () => {
        const dept = { ...department, id: departmentId, admin_id: userSelected ? userSelected.id : null };
        if (!dept.name) {
            setNameError(true);
        } else {
            setNameError(false);
        }
        if (!dept.admin_id) {
            setUserError(true);
        } else {
            setUserError(false);
        }

        if (dept.name && dept.admin_id) {
            save(dept, departmentId ? 'UPDATE' : 'CREATE');
            if (departmentId) {
                saveMember();
            }
            setUserError(false);
        }
    };
    const handleUserSelected = (st) => {
        setUserSelected(st);
        setDepartment({ ...department, admin_id: st.id });
        setIdsSelected(idsSelected.filter((item) => item !== st.id));
    };

    const onSelectUser = (event, uId) => {
        const isChecked = event.target.checked;
        let ids = isChecked ? [...idsSelected, uId] : idsSelected.filter((x) => x != uId);
        setIdsSelected(ids);
        setUserError(false);
    };

    const onSelectAll = (event) => {
        const isChecked = event.target.checked;
        const ids = isChecked ? users.map((x) => x.id) : [];
        setIdsSelected(ids);
    };

    const handleChange = (event) => {
        const newDepartment = { ...department, [event.target.name]: event.target.value };
        setDepartment(newDepartment);
    };

    const handleBlurName = () => {
        if (department.name) {
            setNameError(false);
        } else {
            setNameError(true);
        }
    };

    const closeForm = () => {
        setUserError(false);
        closeFormUpdate(false);
        setNameError(false);
    };

    useEffect(() => {
        if (isShowFormUpdate) {
            if (departmentId) {
                const params = { id: departmentId };
                Get(params).then((res) => {
                    const department = res.find((x) => x.id === departmentId);
                    setDepartment(department);
                    setUserSelected(department.admin);
                    const ids = department.users.map((item) => item.id);
                    setIdsSelected(ids);
                });
                setTitle('Chỉnh sửa phòng ban');
            } else {
                setDepartment((x) => {
                    return { ...DEPARTMENT_DEFAULT };
                });
                setIdsSelected([]);
                setUserSelected(null);
            }
            setUserError(false);
        }
    }, [departmentId, isShowFormUpdate]);

    return (
        <Modal
            id="flipModal"
            modalclassname="flip"
            isOpen={isShowFormUpdate}
            toggle={() => {
                closeForm(false);
            }}
            size="lg"
            centered
        >
            <ModalHeader className="p-3">{title}</ModalHeader>
            <ModalBody>
                <form>
                    <div className="row g-4">
                        <Col xxl={12}>
                            <div>
                                <label htmlFor="name" className="form-label">
                                    Tên phòng ban (<span className="text-danger">*</span>)
                                </label>
                                <Input
                                    name="name"
                                    className="form-control"
                                    type="text"
                                    onChange={(event) => handleChange(event)}
                                    onBlur={() => {
                                        handleBlurName();
                                    }}
                                    value={department.name}
                                />
                                {nameError && <span className="text-danger">Nhập tên phòng ban !</span>}
                            </div>
                        </Col>
                        <Col xxl={12}>
                            <Label for="start-field" className="form-label">
                                Người quản trị (<span className="text-danger">*</span>)
                            </Label>
                            <Select
                                isDisabled={departmentId}
                                value={userSelected}
                                placeholder=""
                                getOptionLabel={(option) => {
                                    return option.full_name;
                                }}
                                getOptionValue={(option) => {
                                    return option.id;
                                }}
                                isMulti={false}
                                onChange={(x) => {
                                    handleUserSelected(x);
                                }}
                                options={users}
                            />
                            {userError && <span className="text-danger">Chọn người quản trị !</span>}
                        </Col>
                        <Col xxl={12}>
                            <div>
                                <label htmlFor="description" className="form-label">
                                    Mô tả
                                </label>
                                <textarea style={{ height: '120px' }} value={department.description} type="text" className="form-control" name="description" onChange={(event) => handleChange(event)} />
                            </div>
                        </Col>

                        {departmentId && (
                            <Col xxl={12}>
                                <Label for="start-field" className="form-label">
                                    Chọn thành viên
                                </Label>
                                <div className="mt-3">
                                    <Table className="table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 5 }}>
                                                    <input type="checkbox" checked={idsSelected.length == users.length} onChange={(x) => onSelectAll(x)} name="all" />
                                                </th>
                                                <th>Tên thành viên</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users
                                                .filter((x) => x.id != userSelected?.id)
                                                .map((u, key) => {
                                                    const isChecked = idsSelected.includes(u.id);
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                <input type="checkbox" onChange={(x) => onSelectUser(x, u.id)} checked={idsSelected.length == users.length || isChecked} />
                                                            </td>
                                                            <td>{u.full_name}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        )}
                        <Col xxl={12}>
                            <div className="hstack gap-2 justify-content-end">
                                <Button color="light" onClick={() => closeForm(false)}>
                                    Đóng
                                </Button>
                                <Button color="success" onClick={() => update()}>
                                    Lưu lại
                                </Button>
                            </div>
                        </Col>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ModalUpdate;
