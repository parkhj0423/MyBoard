import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from 'antd';
import Axios from 'axios';
import { Icon, Tag, Popconfirm, message, Avatar, Card } from 'antd';
import Comment from './Comment/Comment';
import PostLike from './PostLike';
import './PostPage.css';
const { Title } = Typography;
const { Meta } = Card;
function PostPage(props) {
  const postId = props.match.params.postId;
  const [Post, setPost] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    let variable = {
      postId: postId,
    };
    Axios.post('/api/post/getDetailPost', variable).then((response) => {
      if (response.data.success) {
        setPost(response.data.result);

        for (let key in response.data.result.tags) {
          console.log(response.data.result.tags[key]);
        }
      } else {
        alert('글 가져오기 실패');
      }

      Axios.post('/api/comment/getComments', variable).then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          alert('댓글 가져오기 실패!');
        }
      });
    });
  }, []);

  const confirmDelete = (postId, writerId) => {
    if (localStorage.getItem('userId') === writerId) {
      let variable = {
        postId: postId,
      };
      Axios.post('/api/post/deletePost', variable).then((response) => {
        if (response.data.success) {
          message.success('포스트 삭제 성공');
          props.history.push('/');
        } else {
          alert('failed to delete post');
        }
      });
    } else {
      message.error('작성자만 삭제할 수 있습니다');
    }
  };

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  if (Post.writer) {
    let postCreatedDate = Post.createdAt.substring(0, 10);
    let postUpdatedDate = Post.updatedAt.substring(0, 10);
    // let postCreatedTime = Post.createdAt.substring(11,19)
    return (
      <div className="postPage" style={{ width: '80%', margin: '2rem auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <h1 className="postPageName">
            <b>{Post.writer.name}님의 게시글</b>
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <Icon
                className="postPageTitle"
                type="notification"
                theme="outlined"
                style={{
                  fontSize: '1.75rem',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
              <h2
                className="postPageTitle"
                style={{ textAlign: 'center', margin: '0' }}
              >
                <b>{Post.title}</b>
              </h2>
            </div>
            <div style={{ display: 'flex' }}>
              <Icon
                className="postPageDescription"
                type="pushpin"
                theme="outlined"
                style={{
                  fontSize: '1.25rem',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
              <h3
                className="postPageDescription"
                style={{ textAlign: 'center', margin: '0' }}
              >
                {Post.description}
              </h3>
            </div>
          </div>

          {Post.writer._id === localStorage.getItem('userId') && (
            <a href={`/modify/${postId}`} property={Post}>
              <Icon
                className="Icon"
                type="edit"
                theme="filled"
                style={{ fontSize: '2rem', color: 'black' }}
              />
            </a>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
          <div>
            {Post.tags.map((tags, index) => {
              const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
              return (
                <Tag color={colors[index]} key={index}>
                  <a href={`/tags/${tags}`}>{tags}</a>
                </Tag>
              );
            })}
            <p style={{ fontSize: '8px', marginTop: '1rem' }}>
              {postCreatedDate} 에 작성됨
              <br /> {postUpdatedDate}에 마지막으로 수정됨
            </p>
          </div>
          <PostLike postId={postId} userId={localStorage.getItem('userId')} />
        </div>
        <hr />
        <br />
        <div
          className="postText"
          style={{
            background: '#faf7f7',
            padding: '3em',
            borderRadius: '25px',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: Post.text }}  />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
          }}
        >
          <div style={{ display: 'flex', margin: '4rem 0' }}>
            <a href={`/mypage/${Post.writer._id}`}>
              <Meta
                avatar={
                  <Avatar
                    className="postWriterImage"
                    src={Post.writer.image}
                    style={{ width: '150px', height: '150px' }}
                  />
                }
              />
            </a>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                marginLeft: '1rem',
              }}
            >
              <a href={`/mypage/${Post.writer._id}`}>
                <Title level={3}>{Post.writer.name}</Title>
                <p style={{ color: '#868e96', fontSize: '0.75rem' }}>
                  {Post.writer.introduce}
                </p>
              </a>
            </div>
          </div>
          {Post.writer._id === localStorage.getItem('userId') && (
            <Popconfirm
              title="이 포스팅을 삭제하시겠습니까?"
              onConfirm={() => confirmDelete(Post._id, Post.writer._id)}
              okText="예"
              cancelText="아니오"
            >
              <Icon
                className="Icon"
                type="delete"
                key="delete"
                theme="filled"
                style={{ fontSize: '35px' }}
              />
            </Popconfirm>
          )}
        </div>
        <div>
          {/* comment */}
          <Comment
            refreshFunction={refreshFunction}
            commentLists={Comments}
            postId={postId}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ width: '80%', margin: '3rem auto' }}>
        <Icon type="Loading"></Icon>
      </div>
    );
  }
}

export default withRouter(PostPage);
