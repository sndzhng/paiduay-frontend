import React, { Component } from 'react'
import { Layout, Row, Typography } from 'antd';
import 'antd/dist/antd.css';

import UsersComponent from './components/Users'

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

class App extends Component {

  render() {

    return (
      <Layout>
        <Header>
          <Title style={{ color: 'white', marginTop: '6px' }}>Paiduaykanmai</Title>
        </Header>
        <Content>
          <Row>
            <div
              className="container"
              style={{
                marginTop: '2%',
                // marginBottom: '2%',
                marginLeft: '5%',
                marginRight: '5%',
              }}
            >
              <UsersComponent />
            </div>
          </Row>
        </Content>
        <Footer></Footer>
      </Layout >
    )
  }
}

export default App