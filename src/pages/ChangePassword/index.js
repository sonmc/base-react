import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Form, Input, Label, Row, FormFeedback } from 'reactstrap';
import MetaTags from 'react-meta-tags';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ChangePassword } from 'src/Services/user.service';
import { useHistory } from 'react-router-dom';

const ChangePasswordPage = () => {
    const history = useHistory();
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            passwordOld: '',
            passwordNew: '',
            passwordConfirm: '',
        },
        validationSchema: Yup.object({
            passwordOld: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
            passwordNew: Yup.string().required('Vui lòng nhập mật khẩu mới'),
            passwordConfirm: Yup.string()
                .required('Vui lòng xác nhận mật khẩu mới')
                .oneOf([Yup.ref('passwordNew'), null], 'Mật khẩu xác nhận không trùng với mật khẩu mới'),
        }),
        onSubmit: (values) => {
            ChangePassword(values)
                .then((res) => {
                    history.push('/login');
                })
                .catch((err) => {});
        },
    });
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Base core</title>
                </MetaTags>
                <Container fluid>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <div className="card-header pb-0 border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">Thay đổi mật khẩu</h5>
                                    </div>
                                </div>
                                <CardBody className="p-4">
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                        action="#"
                                    >
                                        <Row className="g-2">
                                            <Col lg={7}>
                                                <div>
                                                    <Label htmlFor="oldpasswordInput" className="form-label">
                                                        Mật khẩu cũ <span className="text-danger">*</span>
                                                    </Label>

                                                    <Input name="passwordOld" className="form-control" type="password" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.passwordOld || ''} invalid={validation.errors.passwordOld ? true : false} />
                                                    {validation.touched.passwordOld && validation.errors.passwordOld ? <FormFeedback type="invalid">{validation.errors.passwordOld}</FormFeedback> : null}
                                                </div>
                                            </Col>

                                            <Col lg={7}>
                                                <div>
                                                    <Label htmlFor="newpasswordInput" className="form-label">
                                                        Mật khẩu mới <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input name="passwordNew" className="form-control" type="password" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.passwordNew || ''} invalid={validation.errors.passwordNew ? true : false} />
                                                    {validation.touched.passwordNew && validation.errors.passwordNew ? <FormFeedback type="invalid">{validation.errors.passwordNew}</FormFeedback> : null}
                                                </div>
                                            </Col>

                                            <Col lg={7}>
                                                <div>
                                                    <Label htmlFor="confirmpasswordInput" className="form-label">
                                                        Nhập lại mật khẩu mới <span className="text-danger">*</span>
                                                    </Label>

                                                    <Input name="passwordConfirm" className="form-control" type="password" onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.passwordConfirm || ''} invalid={validation.errors.passwordConfirm ? true : false} />
                                                    {validation.touched.passwordConfirm && validation.errors.passwordConfirm ? <FormFeedback type="invalid">{validation.errors.passwordConfirm}</FormFeedback> : null}
                                                </div>
                                            </Col>

                                            <Col lg={12}>
                                                <div className="text-start">
                                                    <button type="submit" className="btn btn-success">
                                                        Lưu lại
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ChangePasswordPage;
