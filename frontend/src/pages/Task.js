import React, { useEffect, useState } from 'react';
import { Badge, Button, Checkbox, Collapse, Input, Space, Typography } from 'antd';
import { DeleteOutlined, FolderFilled } from '@ant-design/icons'
import { apiClient } from '../shared/apiConfig';
import { openNotification } from '../shared/openNotification';

const { Panel } = Collapse;

const getHeader = (title) => {
    return (
        <Space>
            <FolderFilled />
            <Typography.Text strong>{title}</Typography.Text>
        </Space>
    )
}

const badgeCount = (count = 0) => <Badge count={count} showZero color="#413F3F" />

const Tasks = () => {
    const [todos, setTodos] = useState([])
    const [currentActive, setCurrentActive] = useState(null)
    const [writeCatVisible, setWriteCatVisible] = useState(false)
    const [writeCatValue, setWriteCatValue] = useState("")

    const [writeTodo, setWriteTodo] = useState('')
    const [writeTodoVisible, setWriteTodoVisible] = useState("")
    const [currentTodoIndex, setCurrentTodoIndex] = useState()
    const [currentTodoValue, setCurrentTodoValue] = useState('')

    useEffect(() => {
        if (!writeCatVisible) setWriteCatValue("")
    }, [writeCatVisible])

    const fetchData = () => {
        apiClient.get('/todos').then((res) => {
            setTodos(res.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
    // fetch data 
    useEffect(() => {
        fetchData()
    }, [])


    // accordion functionality
    const handleChange = (current) => {
        setCurrentActive(current)
        setWriteCatValue(false)
        setWriteTodoVisible(false)
        setCurrentTodoIndex()
    }

    // addCategory
    const addCategory = (value) => {
        apiClient.post('/addCategory', { category: value }).then(res => {
            openNotification('success', res.data)
            setWriteCatVisible(false)
            setWriteCatValue("")
            setCurrentActive("")
            fetchData()
        }).catch(err => console.log(err))
    }

    // add sub category/todo
    const addTodo = (values) => {
        apiClient.post('/addTodo', values).then(res => {
            openNotification('success', res.data)
            setWriteTodoVisible(false)
            setWriteTodo("")
            fetchData()
        }).catch(err => {
            setWriteTodoVisible(false)
            setWriteTodo("")
        })
    }

    // delete todo/subcategory
    const deleteTodo = (values) => {
        apiClient.post('/deleteTodo', values).then(res => {
            openNotification('success', res.data)
            fetchData()
        }).catch(err => console.log(err))
        setCurrentTodoIndex('')
        setWriteTodo("")
    }

    // update todo/subcategory
    const updateTodo = (values) => {
        apiClient.post('/updateTodo', values).then(res => {
            openNotification('success', res.data)
            fetchData()
        }).catch(err => console.log(err))
        setCurrentTodoIndex('')
        setWriteTodo("")
    }

    // delete all 
    const deleteAll = () => {
        apiClient.delete('/deleteAll').then(res => {
            openNotification('success', res.data)
            fetchData()

        }).catch(err => console.log(err))
    }

    return (
        <div style={{ padding: '25px' }}>
            <Collapse
                collapsible
                defaultActiveKey={currentActive}
                ghost
                style={{ border: 'none' }}
                accordion
                showArrow={false}
                expandIconPosition='end'
                onChange={handleChange}
            >
                {todos.length > 0 && todos.map((list, index) => (
                    <Panel
                        header={getHeader(list.category)}
                        key={index}
                        extra={currentActive != index && badgeCount(list.child.length)
                        }>
                        <div direction='vertical' style={{ marginLeft: '20px' }}>
                            {list.child.map((child, index) => (
                                <div key={index}>
                                    <Checkbox
                                        key={index}
                                        checked={currentTodoIndex === index + 1}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                // for current index
                                                setCurrentTodoIndex(index + 1)
                                                // for current value for update purpose
                                                setCurrentTodoValue(child.todo)
                                            }
                                            else {
                                                setCurrentTodoIndex(null)
                                                setCurrentTodoValue("")
                                            }
                                        }}
                                    >
                                        <Typography.Text delete={currentTodoIndex === index}>{child.todo}</Typography.Text>
                                    </Checkbox>
                                </div>
                            ))}

                            {/* adding sub category */}
                            <Checkbox style={{ marginTop: '10px' }} checked={writeTodoVisible || currentTodoIndex} onChange={e => setWriteTodoVisible(e.target.checked)}>
                                <Input
                                    readOnly={currentTodoIndex ? false : !writeTodoVisible}
                                    placeholder='Write Todo'
                                    value={!currentTodoIndex ? writeTodo : currentTodoValue}
                                    onChange={e => {
                                        if (!currentTodoIndex) setWriteTodo(e.target.value)
                                        else setCurrentTodoValue(e.target.value)
                                    }}
                                    style={{
                                        marginTop: "-5px",
                                        border: !writeTodoVisible && 'none'
                                    }}
                                    // on key down or enter
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            if (!currentTodoIndex) {
                                                addTodo({ id: list._id, todo: e.target.value })
                                            } else {
                                                updateTodo({ id: list._id, index: currentTodoIndex - 1, todo: e.target.value })
                                            }
                                        }
                                    }}
                                />
                                {(writeTodoVisible || currentTodoIndex) && <span>Press enter to {currentTodoIndex ? "update" : 'save'}!</span>}
                            </Checkbox>

                            {/* delete option */}
                            {currentTodoIndex && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text type='danger'>
                                    Delete selected todo
                                </Typography.Text>
                                <Button onClick={() => deleteTodo({ id: list._id, deleteIndex: currentTodoIndex - 1 })} danger icon={<DeleteOutlined />} />
                            </div>}
                        </div>
                    </Panel>
                ))}

                <Panel
                    collapsible={false}
                    key={"write"}
                    showArrow={false}
                    header={(
                        <Checkbox checked={writeCatVisible} onChange={e => {
                            setWriteCatVisible(e.target.checked)
                            setCurrentActive("")
                        }}>
                            <Input
                                readOnly={!writeCatVisible}
                                placeholder='Write Category'
                                onChange={e => setWriteCatValue(e.target.value)}
                                style={{ marginTop: "-5px", border: !writeCatVisible && 'none' }}
                                // on key down or enter
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addCategory(e.target.value)
                                }}
                            />
                            {writeCatVisible && <span>Press enter to save!</span>}

                        </Checkbox>
                    )}
                />

                {todos.length > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography.Text type='danger'>
                        Delete all!
                    </Typography.Text>
                    <Button onClick={() => deleteAll()} danger icon={<DeleteOutlined />} />
                </div>}
            </Collapse >
        </div>
    )
}
export default Tasks;