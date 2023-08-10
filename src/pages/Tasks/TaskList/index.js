import React, { useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Table, Container, Form, Input, Label, Button } from 'reactstrap';
import { Get as GetUser } from '../../../Services/user.service';
import { Get as GetDepartment } from '../../../Services/department.service';
import { Get as GetTask } from '../../../Services/task.service';
import { Create as CreateTask } from '../../../Services/task.service';
import ModalUpdateTask from '../TaskModal';
import Select from 'react-select';
import { currentUserAtom } from '../../../Recoil/states/users';
import { useRecoilValue } from 'recoil';
import { TASK_STATUS, ROLE } from '../../../Constant';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Empty from 'src/Components/Common/Empty';

const points = [];
for (let index = 1; index <= 10; index++) {
    points.push({ key: index, value: index });
}

const TaskList = () => {
    const currentUser = useRecoilValue(currentUserAtom);
    const [departmentSelected, setDepartmentSelected] = useState();
    const [userSelected, setUserSelected] = useState();
    const [modalCreateTask, setModalCreateTask] = useState(false);
    const [users, setUsers] = useState([]);
    const [taskId, setTaskId] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [taskStore, setTaskStore] = useState([]);

    function togTask(taskId) {
        setTaskId(taskId);
        setModalCreateTask(!modalCreateTask);
    }

    const fetchUsers = (department_id) => {
        GetUser({ department_id }).then((res) => {
            setUsers(res);
        });
    };

    const fetchTasks = (departmentId) => {
        GetTask({ department_id: departmentId }).then((res) => {
            setTaskStore(res);
        });
    };

    const fetchDepartment = () => {
        GetDepartment().then((res) => {
            if (res && res.length > 0) {
                if (currentUser.group_ids == '[2]') {
                    setDepartments(res);
                    setDepartmentSelected({ id: 0, name: 'Tất cả phòng ban' });
                } else if (currentUser.group_ids == '[3]') {
                    const departments = res.filter((d) => d.admin.id == currentUser.id);
                    setDepartments(departments);
                } else {
                    let dept = {};
                    res.forEach((d) => {
                        if (d.admin.id == currentUser.id) {
                            dept = d;
                        }
                    });
                    setDepartmentSelected(dept);
                    setDepartments([dept]);
                }
            }
        });
    };

    function closeModalCreateTask() {
        setModalCreateTask(false);
    }

    const onSaveTask = (t) => {
        CreateTask(t).then((res) => {
            if (t.id) {
                const newTasks = tasks.map((t) => {
                    if (t.id == res.id) {
                        return res;
                    }
                    return t;
                });
                setTaskStore([...newTasks]);
            } else {
                setTaskStore([res, ...tasks]);
            }
            closeModalCreateTask(false);
        });
    };

    const handleDepartmentSelected = (x) => {
        setUserSelected({ id: 0, full_name: 'Tất cả người dùng' });
        setDepartmentSelected(x);
    };

    const handleUserSelected = (x) => {
        setUserSelected(x);
        if (x.id == 0) {
            setTasks(taskStore);
        } else {
            const newTask = taskStore.filter((t) => t.user.id == x.id);
            setTasks(newTask);
        }
    };

    const handleClassStatus = (status) => {
        switch (status) {
            case 1:
                return 'badge badge-soft-warning fs-6';
            case 2:
                return 'badge badge-soft-success fs-6';
            default:
                return 'h3 badge badge-soft-primary fs-6';
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, []);

    useEffect(() => {
        setTasks(taskStore);
    }, [taskStore]);

    useEffect(() => {
        if (departments.length > 0) {
            fetchUsers(0);
        }
    }, [departments]);

    useEffect(() => {
        fetchTasks(departmentSelected ? departmentSelected.id : 0);
        fetchUsers(departmentSelected ? departmentSelected.id : 0);
    }, [departmentSelected]);

    return (
        <React.Fragment>
            <MetaTags>
                <title>Base core</title>
            </MetaTags>
            <div className="page-content">
                <Container fluid>
                    <Card>
                        <div className="card-header pb-0 border-0">
                            <div className="d-flex align-items-center">
                                <h5 className="card-title mb-0 flex-grow-1">Danh sách công việc</h5>
                                <div className="flex-shrink-0">
                                    {currentUser.group_ids != ROLE.staff && (
                                        <button className="btn btn-success" type="button" onClick={() => togTask(null)}>
                                            Thêm mới
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <CardBody>
                            <div className="row">
                                {departments.length > 1 && (
                                    <div className="col-md-3">
                                        <Select
                                            placeholder="Tất cả phòng ban"
                                            value={departmentSelected}
                                            getOptionLabel={(option) => {
                                                return option.name;
                                            }}
                                            getOptionValue={(option) => {
                                                return option.id;
                                            }}
                                            isMulti={false}
                                            onChange={(x) => {
                                                handleDepartmentSelected(x);
                                            }}
                                            options={[{ id: 0, name: 'Tất cả phòng ban' }, ...departments]}
                                        />
                                    </div>
                                )}
                                <div className="col-md-3">
                                    <Select
                                        placeholder="Tất cả người dùng"
                                        value={userSelected}
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
                                        options={[{ id: 0, full_name: 'Tất cả người dùng' }, ...users]}
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <Table className="table-hover table-bordered">
                                    <thead className="tbl-header-custom">
                                        <tr>
                                            <th style={{ width: '5%' }}>STT</th>
                                            <th style={{ width: '12.5%' }}>Tên</th>
                                            <th style={{ width: '12.5%' }}>Người tạo</th>
                                            {currentUser.group_ids != ROLE.staff && <th style={{ width: '12.5%' }}>Người được giao</th>}
                                            {departments.length > 1 && <th style={{ width: '12.5%' }}>Phòng ban</th>}
                                            <th style={{ width: '12.5%' }}>Trạng thái</th>
                                            <th style={{ width: '12.5%' }}>Thời gian bắt đầu</th>
                                            <th style={{ width: '12.5%' }}>Thời gian hết hạn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((d, key) => {
                                            const [monthS, dayS, yearS] = d.start_date.split('/');
                                            const formattedStartDate = `${dayS}-${monthS}-${yearS}`;
                                            const [monthE, dayE, yearE] = d.end_date.split('/');
                                            const formattedEndDate = `${dayE}-${monthE}-${yearE}`;
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>
                                                        <Link to={'#'} onClick={() => togTask(d.id)}>
                                                            {d.title}
                                                        </Link>
                                                    </td>
                                                    <td>{d.creator.username}</td>
                                                    {currentUser.group_ids != ROLE.staff && <td>{d.user.full_name}</td>}

                                                    {departments.length > 1 && <td>{d.department.name}</td>}
                                                    <td>
                                                        <span style={{ width: '90px' }} className={handleClassStatus(d.status)}>
                                                            {TASK_STATUS[d.status]}
                                                        </span>
                                                    </td>

                                                    <td>{formattedStartDate}</td>
                                                    <td>{formattedEndDate}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                                <Empty data={tasks.length} height={50} text={'Không có dữ liệu !'} />
                            </div>
                        </CardBody>
                    </Card>
                    {/* Create modal create task */}
                    <ModalUpdateTask modalCreateTask={modalCreateTask} closeModalCreateTask={closeModalCreateTask} save={onSaveTask} users={users} taskId={taskId} departments={departments || []} departmentSelected={departmentSelected || { id: 0, name: 'Tất cả phòng ban' }} />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TaskList;
