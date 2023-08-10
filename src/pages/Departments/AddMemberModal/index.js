import React, { useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';

const AddMemberModal = (props) => {
    const { isShowModal, closeModal, save, departmentId, users } = props;
    const [idsSelected, setIdsSelected] = useState([]);

    const update = () => {
        const param = {
            departmentId: departmentId,
            ids: idsSelected,
        };
        save(param);
    };

    const onSelectUser = (event, uId) => {
        const isChecked = event.target.checked;
        let ids = isChecked ? [...idsSelected, uId] : idsSelected.filter((x) => x != uId);

        setIdsSelected(ids);
    };

    const onSelectAll = (event) => {
        const isChecked = event.target.checked;
        const ids = isChecked ? users.map((x) => x.id) : [];
        setIdsSelected(ids);
    };

    return (
        <Modal
            id="flipModal"
            modalclassname="flip"
            isOpen={isShowModal}
            toggle={() => {
                closeModal(false);
            }}
            centered
        >
            <ModalHeader className="p-3">Thêm thành viên</ModalHeader>
            <ModalBody>
                <form action="#">
                    <Row className="row">
                        <div className="mt-3">
                            <Table className="table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{ width: 5 }}>
                                            <input type="checkbox" checked={idsSelected.length == users.length} onChange={(x) => onSelectAll(x)} name="all" />
                                        </th>
                                        <th>Tên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, key) => {
                                        const isChecked = idsSelected.includes(u.id);
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <input type="checkbox" onChange={(x) => onSelectUser(x, u.id)} checked={idsSelected.length == users.length || isChecked} />
                                                </td>
                                                <td>{u.username}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Row>
                    <Row className="row">
                        <div className="hstack gap-2 justify-content-end">
                            <Button color="light" onClick={() => closeModal(false)}>
                                Đóng
                            </Button>
                            <Button color="success" onClick={() => update()}>
                                Lưu lại
                            </Button>
                        </div>
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default AddMemberModal;
