import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import './ListTable.css';

interface Todo {
id: number;
name: string;
description: string;
status: string;
}

function ListTable() {
const [show, setShow] = useState(false);
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด'); // เพิ่ม state สำหรับเก็บสถานะที่เลือก

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // บันทึกข้อมูลใหม่ลงใน Local Storage
    const handleAddTodo = () => {
    const id = Math.floor(Math.random() * 10000);
    const newTodo: Todo = { id, name, description, status: "ยังไม่ได้ทำ" };
    setTodos([...todos, newTodo]);
    const updatedTodos = [...todos, newTodo];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    handleClose();
    };

    // บันทึกข้อมูลที่ถูกลบลงใน Local Storage
    const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    };


    // บันทึกข้อมูลที่ถูกเปลี่ยนแปลงลงใน Local Storage
    const handleStatusChange = (id: number, newStatus: string) => {
    const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
    return { ...todo, status: newStatus };
    }
    return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    };


    /// ดึงข้อมูลใน localstorage ออกมาแสดง
    useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[];
    setTodos(storedTodos);
    }, []);


    const handleStatusChanges = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedStatus(event.target.value); // อัปเดตสถานะที่เลือกเมื่อมีการเปลี่ยนแปลงใน dropdown
        };


        const filterTodosByStatus = (status: string) => {
        if (status === 'ทั้งหมด') {
        return todos; // ถ้าเลือกทั้งหมด ให้แสดงทุกรายการ
        } else {
        return todos.filter(todo => todo.status === status); // กรองรายการ Todo ตามสถานะที่เลือก
        }
        };

        return (
        <div className='container card mt-5'>
            <div className="card-body">
                < div className="row">
                    <div className="col">
                        <h3 className='title'>รายการที่ต้องทำ</h3>
                    </div>
                    <div className="col-lg-2">
                        <div className="justify-content-end d-flex">
                        <Button className='button-add' onClick={handleShow}>
                            เพิ่มรายการที่ต้องทำ
                        </Button>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <select value={selectedStatus} onChange={handleStatusChanges}
                            className='form-select form-select-md'>
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            <option value="ยังไม่ได้ทำ">ยังไม่ได้ทำ</option>
                            <option value="กำลังจะทำ">กำลังจะทำ</option>
                            <option value="ทำแล้ว">ทำแล้ว</option>
                        </select>
                    </div>
            </div>
            <div className="justify-content-end d-flex">




            </div>
            <br />
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>ชื่อรายการที่ต้องทำ</th>
                        <th>ตำอธิบาย</th>
                        <th>สถานะ</th>
                        <th>จัดการรายการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filterTodosByStatus(selectedStatus).map((todo, index) => (
                    <tr key={todo.id}>
                        <td>{index + 1}</td>
                        <td>{todo.name}</td>
                        <td>{todo.description}</td>
                        <td>
                            <DropdownButton id={`dropdown-basic-button-${index}`} title={todo.status}
                                variant='outline-dark'>
                                <Dropdown.Item onClick={()=> handleStatusChange(todo.id, "ยังไม่ได้ทำ")}>ยังไม่ได้ทำ
                                </Dropdown.Item>
                                <Dropdown.Item onClick={()=> handleStatusChange(todo.id, "กำลังจะทำ")}>กำลังจะทำ
                                </Dropdown.Item>
                                <Dropdown.Item onClick={()=> handleStatusChange(todo.id, "ทำแล้ว")}>ทำแล้ว
                                </Dropdown.Item>
                            </DropdownButton>
                        </td>
                        <td>
                            <Button variant="light" className='btn btn-outline-danger' onClick={()=>
                                handleDeleteTodo(todo.id)}>
                                ลบรายการ
                            </Button>
                        </td>
                    </tr>
                    ))}

                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มรายการที่ต้องทำ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="ชื่อรายการที่ต้องทำ" value={name} onChange={(e)=>
                            setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control as="textarea" placeholder="รายละเอียด" style={{ height: '100px' }}
                            value={description} onChange={(e)=> setDescription(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddTodo}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
        );
        }

        export default ListTable;