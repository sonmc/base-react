import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, Modal, Row } from 'reactstrap';
import { GetOne as GetTaskDetail } from 'src/Services/task.service';
import Select from 'react-select';
import { currentUserAtom } from '../../../Recoil/states/users';
import { useRecoilValue } from 'recoil';
import { TASK_STATUS, ROLE } from '../../../Constant';
import Flatpickr from 'react-flatpickr';
import { Get as GetUser } from '../../../Services/user.service';

const points = [];
for (let index = 1; index <= 10; index++) {
    points.push({
        backgroundColor: '#fcfcfc',
        color: '#000000',
        value: index,
    });
}
const TASK_DEFAULT = {
    title: '',
    description: '',
    point: 0,
    implement: 0,
    department: { id: 0 },
    status: 0,
    start_date: '',
    end_date: '',
};

const ModalUpdateTask = (props) => {
    const task_status = Object.entries(TASK_STATUS);
    const currentUser = useRecoilValue(currentUserAtom);
    const { modalCreateTask, closeModalCreateTask, save, taskId, departments } = props;
    const [userSelected, setUserSelected] = useState({});
    const [task, setTask] = useState({ ...TASK_DEFAULT });
    const [title, setTitle] = useState('Thêm mới công việc');
    const [titleError, setTitleError] = useState(false);
    const [departmentError, setDepartmentError] = useState(false);
    const [startDateError, setDateStartError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);
    const [departmentList, setDepartments] = useState([]);
    const [implementError, setImplementError] = useState(false);
    const [users, setUsers] = useState([]);
    const [pointList, setPointList] = useState(points);
    const changeField = (event) => {
        if (event.target.name == 'department_id') {
            const department = event.target.value;
            let tg = {
                ...task,
                department: department,
            };
            fetchUsers(department.id);
            setUserSelected(null);
            setTask(tg);
        } else if (event.target.name == 'point') {
            if (task.status && task.status == 2) {
                let tg = {
                    ...task,
                    point: event.target.value,
                };
                const newPoints = points.map((point) => {
                    if (point.value == event.target.value) {
                        point.color = '#fcfcfc';
                        point.backgroundColor = '#002f13';
                    } else {
                        point.color = '#000000';
                        point.backgroundColor = '#fcfcfc';
                    }
                    return point;
                });
                setPointList(newPoints);
                setTask(tg);
            }
        } else {
            let tg = {
                ...task,
                [event.target.name]: event.target.value,
            };
            setTask(tg);
        }
        if (event.target.name == 'start_date') {
            setDateStartError(false);
        }
        if (event.target.name == 'end_date') {
            setEndDateError(false);
        }
    };

    const handleSelectUser = (u) => {
        setUserSelected(u);
    };

    const update = () => {
        const t = { ...task, departmentId: task.department.id, implement: userSelected?.id, status: parseInt(task.status) || 0 };
        if (currentUser.group_ids != '[10]') {
            if (!t.departmentId) {
                setDepartmentError(true);
                return;
            } else {
                setDepartmentError(false);
            }
            if (!t.title) {
                setTitleError(true);
                return;
            }
            if (!t.start_date) {
                setDateStartError(true);
                return;
            } else {
                setDateStartError(false);
            }
            if (!t.end_date) {
                setEndDateError(true);
                return;
            } else {
                setEndDateError(false);
            }
            if (!t.implement) {
                setImplementError(true);
                return;
            } else {
                setImplementError(false);
            }
        }
        save(t);
    };
    function handleEnableStatus(task) {
        if (task.point) {
            return true;
        } else {
            if (!userSelected && !task.implement) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        if (modalCreateTask) {
            if (taskId) {
                const params = { id: taskId };
                GetTaskDetail(params).then((res) => {
                    const user = users.find((u) => u.id == res.implement);
                    if (user) {
                        setUserSelected(user);
                    }
                    setTask({ ...res, implement: res.implement, start_date: new Date(res.start_date), end_date: new Date(res.end_date) });
                    const newPoints = points.map((point) => {
                        if (point.value == res.point) {
                            point.color = '#fcfcfc';
                            point.backgroundColor = '#002f13';
                        } else {
                            point.color = '#000000';
                            point.backgroundColor = '#fcfcfc';
                        }
                        return point;
                    });
                    setPointList(newPoints);
                    setTitle('Chỉnh sửa công việc');
                });
            } else {
                setTask((x) => {
                    return {
                        ...TASK_DEFAULT,
                    };
                });
                const newPoints = points.map((point) => {
                    point.color = '#000000';
                    point.backgroundColor = '#fcfcfc';
                    return point;
                });
                setPointList(newPoints);
                setTitle('Thêm mới công việc');
                setUserSelected(null);
            }
            handleResetForm();
        }
        setTitleError(false);
    }, [modalCreateTask]);

    useEffect(() => {
        setDepartments(departments);
        if (departments.length > 0) {
            if (departments[0].id) {
                setTask({ ...task, department: departments[0] });
                const userList = [];
                departments.forEach((d) => {
                    d.users.forEach((user) => userList.push(user));
                });
                const uniqueUsers = userList.filter((user, index, self) => index === self.findIndex((u) => u.id === user.id));
                setUsers(uniqueUsers);
            }
        }
    }, [departments]);

    const handleResetForm = () => {
        const form = document.getElementById('form-create-task');
        if (form) {
            form.reset();
        }
        setDepartmentError(false);
        setImplementError(false);
        setDateStartError(false);
        setEndDateError(false);
        setTitleError(false);
    };

    const fetchUsers = (department_id) => {
        GetUser({ department_id }).then((res) => {
            setUsers(res);
        });
    };

    const onBlurDepartment = () => {
        if (task.department.id) {
            setDepartmentError(false);
        } else {
            setDepartmentError(true);
        }
    };

    const onBlurTitle = () => {
        if (task.title) {
            setTitleError(false);
        } else {
            setTitleError(true);
        }
    };

    const onBlurImplement = () => {
        if (userSelected?.id) {
            setImplementError(false);
        } else {
            setImplementError(true);
        }
    };

    const handleTitleDisable = (task) => {
        if (currentUser.group_ids == '[2]') {
            return false;
        }
        if (currentUser.group_ids == '[10]' || currentUser.id == task.implement || task.point) {
            return true;
        }
    };

    const handleShowPoint = () => {
        if (currentUser.group_ids == '[2]') {
            return true;
        }
        if (currentUser.group_ids != '[10]' && currentUser.id != task.implement) {
            return false;
        }
    };

    const handleShowImplementOption = () => {
        if (currentUser.group_ids == '[2]') {
            return true;
        }
        if (currentUser.group_ids != '[10]' && currentUser.id != task.implement) {
            return false;
        }
    };
    return (
        <Modal
            size="lg"
            isOpen={modalCreateTask}
            toggle={() => {
                closeModalCreateTask(false);
            }}
            centered
            id="createTaskModal"
            className="border-0"
        >
            <div className="modal-header p-3">
                <h5 className="modal-title" id="createTaskModalLabel">
                    {title}
                </h5>
                <Button
                    onClick={() => {
                        closeModalCreateTask(false);
                    }}
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                ></Button>
            </div>
            <div className="modal-body">
                <Form id="form-create-task">
                    <Row className="g-3">
                        {departmentList && (
                            <Col xxl={12}>
                                <label htmlFor="point" className="form-label">
                                    Phòng ban (<span className="text-danger">*</span>)
                                </label>

                                <Select
                                    value={task.department}
                                    placeholder=""
                                    getOptionLabel={(option) => {
                                        return option.name;
                                    }}
                                    isDisabled={currentUser.group_ids != '[2]' && (currentUser.group_ids == '[10]' || currentUser.id == task.implement || task.point)}
                                    onBlur={() => {
                                        onBlurDepartment();
                                    }}
                                    getOptionValue={(option) => {
                                        return option.id;
                                    }}
                                    isMulti={false}
                                    onChange={(x) => {
                                        changeField({ target: { value: x, name: 'department_id' } });
                                    }}
                                    options={departmentList}
                                />
                                {departmentError && <span className="text-danger">Vui lòng chọn phòng ban!</span>}
                            </Col>
                        )}

                        <Col lg={12}>
                            <Label htmlFor="sub-tasks" className="form-label">
                                Tiêu đề (<span className="text-danger">*</span>)
                            </Label>
                            <Input type="text" value={task.title} disabled={handleTitleDisable(task)} onBlur={() => onBlurTitle()} name="title" onChange={(x) => changeField(x)} className="form-control" id="sub-tasks" />
                            {titleError && <span className="text-danger">Vui lòng nhập tên công việc!</span>}
                        </Col>
                        <Col xxl={6}>
                            <label htmlFor="point" className="form-label">
                                Ngày bắt đầu (<span className="text-danger">*</span>)
                            </label>
                            <Flatpickr
                                className="form-control"
                                disabled={handleTitleDisable(task)}
                                options={{
                                    dateFormat: 'd-m-Y',
                                    maxDate: task.end_date,
                                }}
                                onChange={([value]) => {
                                    changeField({ target: { name: 'start_date', value } });
                                }}
                                value={task.start_date}
                                placeholder=""
                            />
                            {startDateError && <span className="text-danger">Chọn ngày bắt đầu !</span>}
                        </Col>
                        <Col xxl={6}>
                            <label htmlFor="point" className="form-label">
                                Ngày kết thúc (<span className="text-danger">*</span>)
                            </label>
                            <Flatpickr
                                className="form-control"
                                disabled={handleTitleDisable(task)}
                                options={{
                                    dateFormat: 'd-m-Y',
                                }}
                                onChange={([value]) => {
                                    changeField({ target: { name: 'end_date', value } });
                                }}
                                value={task.end_date}
                                placeholder=""
                            />
                            {endDateError && <span className="text-danger">Chọn ngày kết thúc !</span>}
                        </Col>

                        {handleShowImplementOption(task) && (
                            <Col lg={12}>
                                <Label htmlFor="tasks-progress" className="form-label">
                                    Người thực hiện (<span className="text-danger">*</span>)
                                </Label>
                                <Select
                                    value={userSelected}
                                    placeholder=""
                                    isDisabled={task.point}
                                    onBlur={() => onBlurImplement()}
                                    getOptionLabel={(option) => {
                                        return option.full_name;
                                    }}
                                    getOptionValue={(option) => {
                                        return option.id;
                                    }}
                                    isMulti={false}
                                    onChange={(x) => {
                                        handleSelectUser(x);
                                    }}
                                    options={users}
                                />
                                {implementError && <span className="text-danger">Chọn người thực hiện !</span>}
                            </Col>
                        )}
                        <Col xxl={12}>
                            <label htmlFor="point" className="form-label">
                                Chỉnh sửa trạng thái
                            </label>
                            <select
                                disabled={handleEnableStatus(task)}
                                value={task.status}
                                name="status"
                                onChange={(x) => {
                                    changeField(x);
                                }}
                                className="form-control"
                            >
                                {task_status.map((t, index) => {
                                    return (
                                        <option key={index} value={t[0]}>
                                            {t[1]}
                                        </option>
                                    );
                                })}
                            </select>
                        </Col>

                        {handleShowPoint(task) && (
                            <Col xxl={12}>
                                <label htmlFor="point" className="form-label">
                                    Đánh giá
                                </label>
                                <div className="d-flex">
                                    {pointList.map((t, index) => {
                                        return (
                                            <div
                                                onClick={() => changeField({ target: { name: 'point', value: t.value } })}
                                                className="me-3"
                                                key={index}
                                                style={{ backgroundColor: t.backgroundColor, color: t.color, width: '30px', height: '30px', border: '1px solid #e0e0e0', display: 'flex', fontWeight: 700, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }}
                                            >
                                                {t.value}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Col>
                        )}

                        <Col lg={12}>
                            <Label htmlFor="task-description" className="form-label">
                                Mô tả
                            </Label>
                            <textarea style={{ height: '70px' }} className="form-control" value={task.description} name="description" onChange={(x) => changeField(x)} id="task-description" rows="3"></textarea>
                        </Col>

                        <div className="mt-4">
                            <div className="hstack gap-2 justify-content-end">
                                <Button color="light" onClick={() => closeModalCreateTask(false)}>
                                    Đóng
                                </Button>
                                <Button color="success" onClick={() => update()}>
                                    Lưu lại
                                </Button>
                            </div>
                        </div>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
};

export default ModalUpdateTask;
