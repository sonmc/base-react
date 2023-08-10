import React, { useEffect, useState } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, Input, Form, FormFeedback } from 'reactstrap';
import { Get } from 'src/Services/user.service';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const ModalUpdate = (props) => {
    const { isShowFormUpdate, closeFormUpdate, save, userId, usernameDuplicate } = props;
    const [usernameCharacter, setUserError] = useState(false);
    const [user, setUser] = useState({
        username: '',
        full_name: '',
        password: '',
    });
    const [title, setTitle] = useState('Thêm người dùng');

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user.username || '',
            full_name: user.full_name || '',
            password: user.password || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
            full_name: Yup.string().required('Vui lòng nhập họ tên'),
            password: !userId ? Yup.string().required('Vui lòng nhập mật khẩu') : Yup.string(),
        }),
        onSubmit: (values) => {
            const checkUsername = validateInput(values.username);
            if (checkUsername) {
                save({ ...values, id: userId }, userId ? 'UPDATE' : 'CREATE');
                setUserError(false);
            } else {
                setUserError(true);
            }
        },
    });
    function validateInput(input) {
        const regex = /^(\d|\w)+$/g;
        return regex.test(input);
    }
    const { resetForm } = validation;
    const closeForm = () => {
        closeFormUpdate(false);
        resetForm();
        setUserError(false);
    };

    useEffect(() => {
        if (isShowFormUpdate) {
            if (userId) {
                const params = { id: userId };
                Get(params).then((res) => {
                    const user = res.find((item) => item.id === userId);
                    setUser({ ...user });
                });
                setTitle('Chỉnh sửa thông tin');
            } else {
                setUser({
                    username: '',
                    full_name: '',
                    password: '',
                });
                setTitle('Thêm người dùng');
            }
            setUserError(false);
        }
    }, [userId, isShowFormUpdate]);

    useEffect(() => {
        if (usernameDuplicate == 'success') {
            setTimeout(() => {
                resetForm();
            }, 2000);
        }
    }, [usernameDuplicate]);

    return (
        <Modal
            id="flipModal"
            size="md"
            modalclassname="flip"
            isOpen={isShowFormUpdate}
            toggle={() => {
                closeForm(false);
            }}
            centered
        >
            <ModalHeader className="p-3">{title}</ModalHeader>
            <ModalBody>
                <Form onSubmit={validation.handleSubmit}>
                    <div className="row g-4">
                        <Col xxl={12}>
                            <div>
                                <label htmlFor="uname" className="form-label">
                                    Tên đăng nhập (<span className="text-danger">*</span>)
                                </label>
                                <Input name="username" className="form-control" type="text" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.username || ''} invalid={validation.errors.username ? true : false} />
                                {validation.touched.username && validation.errors.username ? <FormFeedback type="invalid">{validation.errors.username}</FormFeedback> : null}
                                {usernameDuplicate && usernameDuplicate != 'success' && <span className="text-danger">Tên đăng nhập đã tồn tại !</span>}
                                {usernameCharacter && <span className="text-danger">Tên đăng nhập không được nhập kí tự đặc biệt !</span>}
                            </div>
                        </Col>
                        <Col xxl={12}>
                            <div>
                                <label htmlFor="name" className="form-label">
                                    Họ và tên (<span className="text-danger">*</span>)
                                </label>
                                <Input name="full_name" className="form-control" type="text" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.full_name || ''} invalid={validation.errors.full_name ? true : false} />
                                {validation.touched.full_name && validation.errors.full_name ? <FormFeedback type="invalid">{validation.errors.full_name}</FormFeedback> : null}
                            </div>
                        </Col>

                        <Col xxl={12}>
                            <div>
                                <label htmlFor="pwd" className="form-label">
                                    {!userId ? (
                                        <>
                                            Mật khẩu (<span className="text-danger">*</span>)
                                        </>
                                    ) : (
                                        'Thay đổi mật khẩu'
                                    )}
                                </label>
                                <Input name="password" className="form-control" type="password" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.password} invalid={validation.errors.password ? true : false} />
                                {validation.touched.password && validation.errors.password ? <FormFeedback type="invalid">{validation.errors.password}</FormFeedback> : null}
                            </div>
                        </Col>

                        <Col xxl={12}>
                            <div className="hstack gap-2 justify-content-end">
                                <Button color="light" onClick={() => closeForm(false)}>
                                    Đóng
                                </Button>
                                <Button color="success" type="submit">
                                    Lưu lại
                                </Button>
                            </div>
                        </Col>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default ModalUpdate;
