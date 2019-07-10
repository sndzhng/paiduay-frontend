import React, { Component } from 'react'
import { Button, Col, Divider, Form, Icon, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Table } from 'antd';
import axios from 'axios';

const { Search } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

class UsersComponent extends Component {

  state = {
    users: [],
    filter: 'em',
    createUserModalVisibility: false,
    updateUserModalVisibility: false,
    email: null,
    name: null,
    surname: null,
    gender: null,
    age: null,
    id: null,
  }

  // - life cycle - //
  componentDidMount = () => {
    this.fetchUsers();
  }

  // - read - //
  fetchUsers = () => {
    axios.get(
      `http://localhost:5000/user`
    )
      .then(
        response => {
          this.setState({
            users: response.data
          })
        }
      )
      .catch(
        function (error) {
          console.log(error);
        }
      )
  }

  // - search - //

  search = (value) => {
    axios.get(
      `http://localhost:5000/user/` + this.state.filter + '=' + value
    )
      .then(
        response => {
          this.setState({
            users: response.data
          })
        }
      )
      .catch(
        function (error) {
          console.log(error);
        }
      )
  }

  filterChange = (value) => {
    this.setState({ filter: value })
  }

  // - create - //
  changeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
  }
  changeName = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  changeSurname = (e) => {
    this.setState({
      surname: e.target.value
    })
  }
  changeGender = (value) => {
    this.setState({
      gender: value
    })
  }
  changeAge = (value) => {
    this.setState({
      age: value
    })
  }

  createCancel = () => {
    this.setState({
      createUserModalVisibility: false,
      email: null,
      first_name: null,
      last_name: null,
      gender: null,
      age: null,
    })
  }

  createConfirm = () => {
    const newUser = {
      email: this.state.email,
      first_name: this.state.name,
      last_name: this.state.surname,
      gender: this.state.gender,
      age: this.state.age,
    };
    axios.post(
      `http://localhost:5000/user`,
      newUser,
    )
      .then(res =>
        // console.log(res.data),
        this.setState({
          createUserModalVisibility: false,
          email: null,
          first_name: null,
          last_name: null,
          gender: null,
          age: null,
        }),
      ).catch(function (error) {
        console.log(error);
      })
  }

  // - update - //
  update = (record) => {
    this.setState({
      updateUserModalVisibility: true,
      email: record.email,
      name: record.first_name,
      surname: record.last_name,
      gender: record.gender,
      age: record.age,
      id: record.id
    })
  }

  updateCancel = () => {
    this.setState({
      updateUserModalVisibility: false,
      email: null,
      first_name: null,
      last_name: null,
      gender: null,
      age: null,
      id: null,
    })
  }

  updateConfirm = () => {
    const editUser = {
      email: this.state.email,
      first_name: this.state.name,
      last_name: this.state.surname,
      gender: this.state.gender,
      age: this.state.age,
    };
    axios.put(
      `http://localhost:5000/user/id=` + this.state.id,
      editUser,
    )
      .then(res =>
        this.fetchUsers(),
        this.setState({
          updateUserModalVisibility: false,
          email: null,
          first_name: null,
          last_name: null,
          gender: null,
          age: null,
          id: null,
        }),
      ).catch(function (error) {
        console.log(error);
      })
  }

  // - delete - //
  delete = (id) => {
    console.log(id)
    axios.delete(
      `http://localhost:5000/user/id=` + id
    )
      .then(res => {
        const users = [...this.state.users];
        this.setState({ users: users.filter(item => item.id !== id) });
      })
      .catch(
        function (error) {
          console.log(error);
        }
      )

  }

  // - render - //
  render() {
    const { users } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Name',
        dataIndex: 'first_name',
        key: 'name',
      },
      {
        title: 'Surname',
        dataIndex: 'last_name',
        key: 'surname',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a style={{ color: '#008CBA' }} onClick={() => this.update(record)}><Icon type='edit' /> Edit</a>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.id)}>
              <a style={{ color: '#f44336' }}><Icon type='delete' /> Delete</a></Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div>

        {/* - Menu - */}
        <Row>
          <Col span='8'>
            <Button
              type='primary'
              size='default'
              onClick={() => this.setState({ createUserModalVisibility: true })}
            >
              <Icon type='plus' />
              New User
            </Button>
          </Col>
          <Col span='8'></Col>
          <Col span='8'>
            <InputGroup compact >
              <Select
                defaultValue="em"
                style={{ width: '20%' }}
                onChange={this.filterChange}
              >
                <Option value="em">Email</Option>
                <Option value="fn">Name</Option>
                <Option value="ln">Surname</Option>
                <Option value="g">Gender</Option>
                <Option value="a">Age</Option>
              </Select>
              <Search
                style={{ width: '80%' }}
                placeholder="input search text"
                onSearch={value => this.search(value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* - Table - */}
        <Row style={{ paddingTop: '10px' }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey='id'
            size='middle'
          />
        </Row>

        {/* - Create Modal - */}
        <Modal
          title='New User'
          visible={this.state.createUserModalVisibility}
          onCancel={this.createCancel}
          footer={[
            <Button
              key='cancel'
              onClick={this.createCancel}
            >
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={this.createConfirm}
            >
              Confirm
            </Button>,
          ]}
          width='40%'
        >
          <Form layout="vertical" hideRequiredMark>

            <Form.Item
              label='Email'
            // style={{ fontWeight: 'bold', fontSize: 30 }}
            >
              <Input
                defaultValue={null}
                onChange={this.changeEmail}
                required={true}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>

                <Form.Item
                  label='Name'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Input
                    defaultValue={null}
                    onChange={this.changeName}
                    required={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Surname'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Input
                    defaultValue={null}
                    onChange={this.changeSurname}
                    required={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Gender'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Select
                    style={{ width: '50%' }}
                    onChange={this.changeGender}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Age'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    defaultValue={null}
                    onChange={this.changeAge}
                    required={true}
                    max='100'
                    min='1'
                  />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>

        {/* - Update Modal - */}
        <Modal
          title='Edit User'
          visible={this.state.updateUserModalVisibility}
          onCancel={this.updateCancel}
          footer={[
            <Button
              key='cancel'
              onClick={this.updateCancel}
            >
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={this.updateConfirm}
            >
              Confirm
            </Button>,
          ]}
          width='40%'
        >
          <Form layout="vertical" hideRequiredMark>

            <Form.Item
              label='Email'
            // style={{ fontWeight: 'bold', fontSize: 30 }}
            >
              <Input
                value={this.state.email}
                onChange={this.changeEmail}
                required={true}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>

                <Form.Item
                  label='Name'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Input
                    value={this.state.name}
                    onChange={this.changeName}
                    required={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Surname'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Input
                    value={this.state.surname}
                    onChange={this.changeSurname}
                    required={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Gender'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <Select
                    value={this.state.gender}
                    style={{ width: '50%' }}
                    onChange={this.changeGender}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Age'
                // style={{ fontWeight: 'bold', fontSize: 30 }}
                >
                  <InputNumber
                    value={this.state.age}
                    style={{ width: '50%' }}
                    defaultValue={null}
                    onChange={this.changeAge}
                    required={true}
                    max='100'
                    min='1'
                  />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>

      </div>
    )
  }
}

export default UsersComponent