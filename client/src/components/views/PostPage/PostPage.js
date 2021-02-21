import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from 'antd';
import Axios from 'axios';
import { Icon, Tag, Popconfirm, message } from 'antd';
import Comment from './Comment/Comment';
const { Title } = Typography;

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
          props.history.push('/')
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
          <Title level={2}>{Post.writer.name}`s Post</Title>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '30px',
          }}
        >
          <div style={{ display: 'flex' }}>
            <Icon
              type="notification"
              theme="outlined"
              style={{ fontSize: '25px', marginRight: '15px' }}
            />
            <Title level={4}>{Post.title}</Title>
          </div>

          {Post.writer._id === localStorage.getItem('userId') && (
            <a href={`/modify/${postId}`} property={Post}>
              <Icon type="edit" theme="filled" style={{ fontSize: '35px' }} />
            </a>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <div>
            {Post.tags.map((tags, index) => {
              const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
              return (
                <Tag color={colors[index]} key={index}>
                  {tags}
                </Tag>
              );
            })}
          </div>
          <p style={{ fontSize: '8px' }}>
            {postCreatedDate} 에 작성됨
            <br /> {postUpdatedDate}에 마지막으로 수정됨
          </p>
        </div>
        <hr />
        <br />
        <div
          style={{
            background: '#faf7f7',
            padding: '3em',
            borderRadius: '35px',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: Post.text }} />
        </div>
        {Post.writer._id === localStorage.getItem('userId') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '15px',
            }}
          >
            <Popconfirm
              title="이 포스팅을 삭제하시겠습니까?"
              onConfirm={() => confirmDelete(Post._id, Post.writer._id)}
              okText="예"
              cancelText="아니오"
            >
              <Icon
                type="delete"
                key="delete"
                theme="filled"
                style={{ fontSize: '35px' }}
              />
            </Popconfirm>
          </div>
        )}
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
