import React, { useEffect, useState } from 'react';
import { CardBody, Col, Container, Table, Progress } from 'reactstrap';
import MetaTags from 'react-meta-tags';
import { Get as GetReport } from 'src/Services/report.service';
import { Get as GetDepartment } from 'src/Services/department.service';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { currentUserAtom } from '../../Recoil/states/users';
import { useRecoilValue } from 'recoil';
import { ROLE } from '../../Constant';
import Empty from 'src/Components/Common/Empty';

const ReportPage = () => {
    const currentUser = useRecoilValue(currentUserAtom);
    const [departmentSelected, setDepartmentSelected] = useState();
    const [departments, setDepartments] = useState([]);
    const [reports, setReport] = useState([]);
    const [filter, setFilter] = useState({
        start_date: new Date(new Date().setDate(new Date().getDate() - 30)),
        end_date: new Date(),
        department_id: 0,
    });

    const fetchDepartment = () => {
        GetDepartment().then((res) => {
            if (res && res.length > 0) {
                if (currentUser.group_ids == '[2]') {
                    setDepartments(res);
                    setFilter({ ...filter, department_id: 0 });
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
                    setFilter({ ...filter, department_id: dept.id });
                    setDepartments(dept);
                }
            }
        });
    };

    const fetchReport = (filter) => {
        GetReport(filter).then((res) => {
            setReport(res);
        });
    };
    const changeFilter = (event) => {
        setFilter({ ...filter, [event.target.name]: event.target.value });
    };

    const handleDepartmentSelected = (x) => {
        setDepartmentSelected(x);
        setFilter({ ...filter, department_id: x.id });
    };

    useEffect(() => {
        if (currentUser.group_ids == ROLE.Staff) {
            if (filter.department_id) {
                fetchReport(filter);
            }
        } else {
            fetchReport(filter);
        }
    }, [filter]);

    useEffect(() => {
        fetchDepartment();
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
                                <div className="card-header border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">Thống kê</h5>
                                    </div>
                                </div>
                                <div className="card-body pt-0 pb-0">
                                    <form>
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
                                            <div className="col-xxl-3 col-sm-3 d-flex">
                                                <label className="mx-3" style={{ marginTop: '10px' }}>
                                                    Từ
                                                </label>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                        dateFormat: 'd-m-Y',
                                                        maxDate: filter.end_date,
                                                    }}
                                                    onChange={([value]) => {
                                                        changeFilter({ target: { name: 'start_date', value } });
                                                    }}
                                                    value={filter.start_date}
                                                    placeholder="Ngày bắt đầu"
                                                />
                                            </div>
                                            <div className="col-xxl-3 col-sm-3 d-flex">
                                                <label className="mx-3" style={{ marginTop: '10px' }}>
                                                    Đến
                                                </label>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                        dateFormat: 'd-m-Y',
                                                        maxDate: filter.end_date,
                                                    }}
                                                    onChange={([value]) => {
                                                        changeFilter({ target: { name: 'end_date', value } });
                                                    }}
                                                    value={filter.end_date}
                                                    placeholder="Ngày kết thúc"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <CardBody>
                                    <div className="mt-3">
                                        <Table className="table-hover table-bordered">
                                            <thead className="tbl-header-custom">
                                                <tr>
                                                    <th style={{ width: '5%' }}>STT</th>
                                                    <th style={{ width: '20%' }}>Tên người thực hiện</th>
                                                    <th style={{ width: '20%' }}>Số lượng công việc</th>
                                                    <th style={{ width: '20%' }}>Danh sách công việc</th>
                                                    <th>Điểm hoàn thành</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reports.map((d, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>{d.username}</td>
                                                            <td>{d.taskNumber}</td>
                                                            <td>
                                                                <ul>
                                                                    {d.taskNames.map((taskName, index) => (
                                                                        <li key={index}>{taskName}</li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Progress color="primary" className="animated-progess custom-progress progress-label" value={d.point}>
                                                                    <div className="label">{d.point}%</div>{' '}
                                                                </Progress>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                        <Empty data={reports.length} height={50} text={'Không có dữ liệu !'} />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ReportPage;
