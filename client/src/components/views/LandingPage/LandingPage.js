import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Carousel, Typography, Icon, Row, Col, Avatar, Card, Tag } from 'antd';
import Axios from 'axios';
import Pagination from './pagination';

const { Title } = Typography;
const { Meta } = Card;
function LandingPage(props) {
  const contentStyle = {
    height: '300px',
    lineHeight: '300px',
    fontSize: '30px',
    color: '#fff',
    textAlign: 'center',
    background: '#292928',
  };

  const [PostList, setPostList] = useState([]);
  const [Comments, setComments] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostsPerPage] = useState(8);
  //get Current page
  const indexOfLastPost = CurrentPage * PostsPerPage;
  const indexOfFirstPost = indexOfLastPost - PostsPerPage;
  const CurrentPosts = PostList.slice(indexOfFirstPost, indexOfLastPost);

  //! change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getPostList();

    Axios.post('/api/comment/getCommentsLength').then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        alert('댓글 가져오기 실패!');
      }
    });
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

  const renderCards = CurrentPosts.map((postlist, index) => {
    //포스트 생성일
    let postCreatedDate = postlist.createdAt.substring(0, 10);

    //랜딩페이지 포스트 썸네일 ImageURL 추출 본문의 내용중 가장 첫번째 이미지가 썸네일이 된다.
    //이미지가 없는 포스트일 경우 대체 GIF 파일로 대체
    let imageUrl = '';
    const textSplit = postlist.text.split('<img src="')[1];
    if (textSplit !== undefined) {
      imageUrl = textSplit.split('"')[0];
    }

    // 댓글 수
    let postComment = Comments.filter(
      (comment) => postlist._id === comment.postId,
    );

    return (
      <Col key={index} lg={6} md={12} xs={24}>
        <a href={`/board/${postlist._id}`}>
          <Card
            hoverable
            style={{
              width: '320px',
              margin: '16px auto',
              borderRadius: '10px',
            }}
            cover={
              <img
                style={{ width: '100%', height: '167px' }}
                alt="thumbnail"
                src={
                  imageUrl
                    ? imageUrl
                    : 'https://media.giphy.com/media/l3vRdNUR4XPpRoPmM/giphy.gif'
                }
              />
            }
            actions={[
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 0.5rem',
                }}
              >
                <Meta
                  avatar={<Avatar src={postlist.writer.image} />}
                  title={
                    <b style={{ fontSize: '0.7rem', marginLeft:'0.5rem' }}>
                      {postlist.writer.name}
                    </b>
                  }
                />
                <div>
                  <Icon
                    type="heart"
                    theme={'filled'}
                    style={{ marginRight: '0.25rem' }}
                  />
                  {postlist.likes}
                </div>
              </div>,
            ]}
          >
            <div style={{ height: '110px' }}>
              <Title level={4}>{postlist.title}</Title>
              <p style={{ color: '#868e96' }}>{postlist.description}</p>
            </div>
            <br />

            <div
              style={{
                width: '100%',
                margin: '10px 0',
              }}
            >
              {postlist.tags.map((tags, index) => {
                const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
                return (
                  <Tag color={colors[index]} key={index}>
                    {tags}
                  </Tag>
                );
              })}
            </div>

            <p
              style={{
                display: 'flex',
                fontSize: '0.75rem',
                lineHeight: '1.5',
                color: '#868e96',
              }}
            >
              {postCreatedDate} 에 작성됨 ● {postComment.length} 개의 댓글
            </p>
          </Card>
        </a>
      </Col>
    );
  });

  return (
    <div>
      <Carousel autoplay dotPosition="top" style={{ height: '300px' }}>
        <div>
          <h3 style={contentStyle}>Welcome!</h3>
        </div>
        <div>
          <h3 style={contentStyle}>How was your day?</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Write it Now!</h3>
        </div>
      </Carousel>
      <div style={{ width: '85%', margin: '3rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={2}>게시글</Title>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Icon
              type="search"
              theme="outlined"
              onClick={() => props.history.push('/search')}
              style={{ fontSize: '40px', marginRight: '20px',zIndex:'2'}}
            />
            <Icon
              type="plus-circle"
              theme="outlined"
              onClick={() => props.history.push('/upload')}
              style={{ fontSize: '40px',zIndex:'2' }}
            />
          </div>
        </div>
        <hr />

        {/* 리스트 표시 */}
        <div>
          <Row gutter={[32, 32]}>{renderCards}</Row>
          <Pagination
            PostsPerPage={PostsPerPage}
            totalPosts={PostList.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
