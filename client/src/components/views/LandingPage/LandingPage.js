import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Carousel, Typography, Icon, Row, Col, Avatar, Card } from 'antd';
import Axios from 'axios';
const { Title } = Typography;
const { Meta } = Card;
function LandingPage(props) {
  const contentStyle = {
    height: '300px',
    lineHeight: '300px',
    fontSize: '40px',
    color: '#fff',
    textAlign: 'center',
    background: '#292928',
  };

  const [PostList, setPostList] = useState([]);

  useEffect(() => {
    let variable = {
      writer: localStorage.getItem('userId'),
    };
    Axios.post('/api/post/getPost', variable).then((response) => {
      if (response.data.success) {
        console.log('postList', response.data.result);
        setPostList(response.data.result);
      } else {
        alert('글 가져오기 실패');
      }
    });
  }, []);

  const renderCards = PostList.map((postlist, index) => {
    return <Col key={index} lg={8} md={12} xs={24}>
      <Card
        hoverable
        style={{ width: 370, marginTop: 16 }}
        actions={[
          <Icon type="setting" key="setting" />,
          <Icon type="edit" key="edit" />,
          <a href={`/board/${postlist._id}`}>
            <Icon type="ellipsis" key="ellipsis" />
          </a>
        ]}
      >
        <Meta
          avatar={<Avatar src={postlist.writer.image} />}
          title={postlist.writer.name}
          description={postlist.title}
        />
        <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
          <div dangerouslySetInnerHTML={{ __html: postlist.text }} />
        </div>
      </Card>
    </Col>
  });

  return (
    <div>
      <Carousel autoplay dotPosition="top">
        <div>
          <h3 style={contentStyle}>Welcome!</h3>
        </div>
        <div>
          <h3 style={contentStyle}>How's your daily Life?</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Write it Now!</h3>
        </div>
      </Carousel>
      <div style={{ width: '85%', margin: '3rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={1}>Posts!</Title>
          <Icon
            type="plus-circle"
            theme="outlined"
            rotate="0"
            onClick={() => props.history.push('/board/upload')}
            style={{ fontSize: '50px' }}
          ></Icon>
        </div>
        <hr />

        {/* 리스트 표시 */}

        <Row gutter={[32, 16]}>{renderCards}</Row>
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
