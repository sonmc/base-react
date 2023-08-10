import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Modal, UncontrolledDropdown } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import moment from 'moment';
import { TASK_STATUS } from '../../Constant';

const CardTaskBox = (props) => {
    const { data, users, board, name } = props;
    const [userImplement, setUserImplement] = useState({ username: '' });
    const [modal_delete, setmodal_delete] = useState(false);
    function tog_delete() {
        setmodal_delete(!modal_delete);
    }

    function getTaskGroupId(taskId) {
        let taskGroupId = 0;
        board.columns.forEach((c) => {
            c.tasks.forEach((t) => {
                if (taskId == t.id) {
                    taskGroupId = c.id;
                }
            });
        });
        return taskGroupId;
    }
    const handleClassStatus = (status) => {
        switch (status) {
            case 1:
                return 'badge badge-soft-warning me-1';
            case 2:
                return 'badge badge-soft-success me-1';
            default:
                return 'badge badge-soft-primary me-1';
        }
    };
    const togTask = (taskId) => {
        const taskGroupId = getTaskGroupId(taskId);
        props.togTask(taskGroupId, taskId);
    };

    useEffect(() => {
        const user = users.find((x) => x.id == data.implement);
        setUserImplement(user || { username: '' });
    }, [data, users]);
    return (
        <React.Fragment>
            <div className="tasks-board" id="kanbanboard">
                <div className="tasks-list">
                    <SimpleBar className="tasks-wrapper px-3 mx-n3">
                        <div id="unassigned-task" className="tasks">
                            <Card className="tasks-box" style="box-shadow">
                                <CardBody>
                                    <div className="d-flex mb-2">
                                        <h6 className="fs-15 mb-0 flex-grow-1 text-truncate">
                                            {data.isTaskIdHeader ? (
                                                <Link to="#" className="text-muted fw-medium fs-14 flex-grow-1">
                                                    {data.id}
                                                </Link>
                                            ) : (
                                                <Link to="#" onClick={() => togTask(data.id)}>
                                                    {data.title}
                                                </Link>
                                            )}
                                        </h6>
                                        <UncontrolledDropdown direction="start">
                                            <DropdownToggle tag="a" id="dropdownMenuLink1" role="button">
                                                <i className="ri-more-fill" />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem tag="a" to="/apps-tasks-details">
                                                    <i className="ri-eye-fill align-bottom me-2 text-muted" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <i className="ri-edit-2-line align-bottom me-2 text-muted" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => {
                                                        tog_delete();
                                                    }}
                                                    to="#deleteRecordModal"
                                                >
                                                    <i className="ri-delete-bin-5-line align-bottom me-2 text-muted" />
                                                    Delete
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>

                                    {data.isTaskIdHeader && (
                                        <h6 className="fs-15 text-truncate">
                                            <Link to="/apps-tasks-details">{data.title}</Link>
                                        </h6>
                                    )}

                                    {data.bgImage ? <div className="tasks-img rounded" style={{ background: `url(${data.bgImage})` }}></div> : <p className="text-muted">{data.description}</p>}

                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <span className={handleClassStatus(data.status)}>{TASK_STATUS[data.status]}</span>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="avatar-group">
                                                <Link to="#" className="avatar-group-item">
                                                    <span className="rounded-circle avatar-xxs">{userImplement.username.charAt(0).toUpperCase()}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                                <div className="card-footer border-top-dashed p-2">
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <span className="text-muted">
                                                <i className="ri-time-line align-bottom mr-2"></i>
                                                {moment(data.start_date).format('DD/MM/yyyy hh:mm')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </SimpleBar>
                </div>
            </div>

            <Modal
                isOpen={modal_delete}
                toggle={() => {
                    tog_delete();
                }}
                centered
                modalClassName="zoomIn"
                id="deleteRecordModal"
            >
                <div className="modal-header">
                    <Button
                        type="button"
                        onClick={() => {
                            setmodal_delete(false);
                        }}
                        className="btn-close"
                        aria-label="Close"
                    ></Button>
                </div>
                <div className="modal-body">
                    <div className="mt-2 text-center">
                        <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style={{ width: '100px', height: '100px' }}></lord-icon>
                        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                            <h4>Bạn có muốn ?</h4>
                            <p className="text-muted mx-4 mb-0">Bạn có muốn xoá công việc này ?</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                        <Button color="light" className="w-sm" onClick={() => setmodal_delete(false)}>
                            Đóng
                        </Button>
                        <Button color="danger" className="w-sm" id="delete-record">
                            Xác nhận!
                        </Button>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default CardTaskBox;
