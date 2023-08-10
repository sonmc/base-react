import React, { useEffect, useState } from 'react';
import { Col, Row, Button, Modal, ModalHeader, ModalBody, Input, Label } from 'reactstrap';
import { Get } from 'src/Services/workspace.service';
import { Upload } from 'src/Services/upload.service';
import Select from 'react-select';
import avatar1 from 'src/assets/images/default.png';

const WORKSPACE_DEFAULT = {
    admin_id: 0,
    title: '',
    description: '',
    logo: '',
};

const ModalUpdate = (props) => {
    const { isShowFormUpdate, closeFormUpdate, save, workspaceId, users } = props;
    const [userSelected, setUserSelected] = useState({ full_name: '' });
    const [workspace, setWorkspace] = useState({ ...WORKSPACE_DEFAULT });
    const [title, setTitle] = useState('Tạo công ty');
    const [avatar, setAvatar] = useState(avatar1);
    const [titleError, setTitleError] = useState(false);
    const [userError, setUserError] = useState(false);
    const changeField = (event) => {
        let w = {
            ...workspace,
            [event.target.name]: event.target.value,
        };
        setWorkspace(w);
    };

    const closeForm = () => {
        setTitleError(false);
        closeFormUpdate(false);
    };
    const update = () => {
        if (!workspace.title) {
            setTitleError(true);
        } else {
            setTitleError(false);
        }

        if (!userSelected.full_name) {
            setUserError(true);
        } else {
            setUserError(false);
        }

        if (workspace.title && userSelected.full_name) {
            save(workspace, workspaceId ? 'UPDATE' : 'CREATE');
        }
    };

    const handleUserSelected = (st) => {
        setUserSelected(st);
        setWorkspace({ ...workspace, admin_id: st.id });
    };

    const handleTitleBlur = () => {
        if (!workspace.title) {
            setTitleError(true);
        } else {
            setTitleError(false);
        }
    };

    const handleUserBlur = () => {
        if (!userSelected.full_name) {
            setUserError(true);
        } else {
            setUserError(false);
        }
    };

    useEffect(() => {
        if (isShowFormUpdate) {
            if (workspaceId) {
                const params = { id: workspaceId };
                Get(params).then((res) => {
                    const workspace = res.find((item) => item.id === workspaceId);
                    const admin = workspace.users.find((x) => x.is_owner);
                    if (admin) {
                        setUserSelected(admin);
                    }
                    setAvatar(workspace.logo);

                    setWorkspace(workspace);
                });
                setTitle('Chỉnh sửa công ty');
            } else {
                setUserSelected({ full_name: '' });
                setWorkspace({
                    admin_id: 0,
                    title: '',
                    description: '',
                    logo: '',
                });
                setAvatar('');
                setTitle('Tạo công ty');
            }
            setUserError(false);
            setTitleError(false);
        }
    }, [workspaceId, isShowFormUpdate]);

    const UploadImage = (e) => {
        let files = e.target.files;
        Upload(files)
            .then((res) => {
                setAvatar(res.imagePath);
                setWorkspace({ ...workspace, logo: res.imagePath });
            })
            .catch((err) => {});
    };
    return (
        <Modal
            id="flipModal"
            size="lg"
            modalclassname="flip"
            isOpen={isShowFormUpdate}
            toggle={() => {
                closeForm(false);
            }}
            centered
        >
            <ModalHeader className="p-3">{title}</ModalHeader>
            <ModalBody>
                <form action="#">
                    <Row>
                        <Col xxl={3}>
                            <label htmlFor="name" className="form-label mb-0">
                                Logo
                            </label>
                            <br />
                            <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                <img
                                    className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                    alt="user-profile"
                                    src={avatar}
                                    onError={() => {
                                        setAvatar(avatar1);
                                    }}
                                />
                                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                    <Input id="profile-img-file-input" type="file" className="profile-img-file-input" onChange={UploadImage} />
                                    <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                                        <span className="avatar-title rounded-circle bg-light text-body">
                                            <i className="ri-camera-fill"></i>
                                        </span>
                                    </Label>
                                </div>
                            </div>
                        </Col>
                        <Col xxl={9}>
                            <Col xxl={12}>
                                <div>
                                    <label htmlFor="name" className="form-label">
                                        Tên công ty (<span className="text-danger">*</span>)
                                    </label>
                                    <Input value={workspace.title} type="text" onBlur={() => handleTitleBlur()} className="form-control" name="title" onChange={(x) => changeField(x)} />
                                    {titleError && <span className="text-danger">Tên công ty không được để trống!</span>}
                                </div>
                            </Col>
                            {workspaceId ? (
                                <Col xxl={12} className="mt-2">
                                    <Label for="start-field" className="form-label">
                                        Người quản trị
                                    </Label>
                                    <select className="form-control" disabled>
                                        <option> {userSelected.full_name}</option>
                                    </select>
                                </Col>
                            ) : (
                                <Col xxl={12} className="mt-2">
                                    <Label for="start-field" className="form-label">
                                        Chọn người quản trị ( <span className="text-danger">*</span>)
                                    </Label>
                                    <Select
                                        value={userSelected}
                                        getOptionLabel={(option) => {
                                            return option.full_name;
                                        }}
                                        getOptionValue={(option) => {
                                            return option.id;
                                        }}
                                        onBlur={() => handleUserBlur()}
                                        isMulti={false}
                                        onChange={(x) => {
                                            handleUserSelected(x);
                                        }}
                                        options={users}
                                    />
                                    {userError && <span className="text-danger">Chọn người quản trị !</span>}
                                </Col>
                            )}
                            <Col xxl={12} className="mt-2">
                                <label htmlFor="name" className="form-label">
                                    Mô tả
                                </label>
                                <textarea style={{ height: '120px' }} value={workspace.description} type="text" className="form-control" name="description" onChange={(x) => changeField(x)} />
                            </Col>
                        </Col>
                    </Row>
                    <div className="row mt-3">
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
