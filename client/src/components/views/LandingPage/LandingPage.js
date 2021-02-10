import React, { useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import {
  Carousel,
  Typography,
  Icon,
  Row,
  Col,
  Avatar,
  Card,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import Axios from 'axios';
import Pagination from './pagination';

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
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostsPerPage, setPostsPerPage] = useState(8);
  const [Like, setLike] = useState(false);
  //get Current page
  const indexOfLastPost = CurrentPage * PostsPerPage;
  const indexOfFirstPost = indexOfLastPost - PostsPerPage;
  const CurrentPosts = PostList.slice(indexOfFirstPost, indexOfLastPost);
  
  
  //! change page
  const paginate = (pageNumber)=> {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    getPostList();
  }, []);

  const getPostList = () => {
    Axios.post('/api/post/getPost').then((response) => {
      if (response.data.success) {
        console.log('postList-LandingPage', response.data.result);
        setPostList(response.data.result);
      } else {
        alert('글 가져오기 실패');
      }
    });
  };

  const confirmDelete = (postId, writerId) => {
    if (localStorage.getItem('userId') === writerId) {
      let variable = {
        postId: postId,
      };
      Axios.post('/api/post/deletePost', variable).then((response) => {
        if (response.data.success) {
          message.success('포스트 삭제 성공');
          getPostList();
        } else {
          alert('failed to delete post');
        }
      });
    } else {
      message.error('작성자만 삭제할 수 있습니다');
    }
  };



  const onLikeClick = () => {
    setLike(!Like);
  };

  const renderCards = CurrentPosts.map((postlist, index) => {
    return (
      <Col key={index} lg={6} md={12} xs={24}>
        <Card
          hoverable
          style={{ width: '85%', margin: '16px auto', borderRadius: '50px' }}
          actions={[
            <a href={`/board/${postlist._id}`}>
              <Icon type="zoom-in" key="zoom-in" />
            </a>,

            // <Icon type="edit" key="edit" onClick={() => props.history.push('/board/modify')} />,
            <Icon
              type="heart"
              theme={Like ? 'filled' : 'outlined'}
              onClick={onLikeClick}
            />,

            <Popconfirm
              title="이 포스팅을 삭제하시겠습니까?"
              onConfirm={() => confirmDelete(postlist._id, postlist.writer._id)}
              okText="예"
              cancelText="아니오"
            >
              <Icon type="delete" key="delete" theme="outlined" />
            </Popconfirm>,
          ]}
        >
          <Meta
            avatar={<Avatar src={postlist.writer.image} />}
            title={postlist.writer.name}
            description={postlist.title}
          />
          <div
            style={{
              width: '100%',
              margin: '10px 0',
            }}
          >
            {postlist.tags.map((tags, index) => {
              const colors = ['#f50','#2db7f5','#87d068','#108ee9']      
              return (
                <Tag color={colors[index]} key={index}>
                  {tags}
                </Tag>
              );
            })}
          </div>
          <hr />
          <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
            <div dangerouslySetInnerHTML={{ __html: postlist.text }} />
          </div>
        </Card>
      </Col>
    );
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
            onClick={() => props.history.push('/upload')}
            style={{ fontSize: '50px' }}
          ></Icon>
        </div>
        <hr />

        {/* 리스트 표시 */}
        <div style={{}}>
          <div
            style={{
              width: '100%',
              height: '150px',
              border: '1px solid',
              borderRadius: '10px',
            }}
          >
            ddd
          </div>
          <Row gutter={[32, 32]}>{renderCards}</Row>
          <Pagination PostsPerPage={PostsPerPage} totalPosts={PostList.length} paginate={paginate} />
        </div>
      </div>
      
    </div>
  );
}

export default withRouter(LandingPage);
