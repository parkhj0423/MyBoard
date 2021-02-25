import { Button, message, Popconfirm } from 'antd';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';

function DeletePage(props) {
  const onUserDeleteClick = () => {
    Axios.post('/api/users/deleteUser', {
      _id: localStorage.getItem('userId'),
    }).then((response) => {
      if (response.data.success) {
        message.success('Success to delete user');
      } else {
        message.error('Failed to delete user');
      }
    });

    Axios.post('/api/post/deleteAllPosts', {
      writer: localStorage.getItem('userId'),
    }).then((response) => {
      if (response.data.success) {
        message.success('Success to delete posts');
      } else {
        message.error('Failed to delete user');
      }
    });

    Axios.post('/api/comment/deleteAllComments', {
      writer: localStorage.getItem('userId'),
    }).then((response) => {
      if (response.data.success) {
        message.success('Success to delete comment');
      } else {
        message.error('Failed to delete user');
      }
    });
    localStorage.setItem('userId','')
    localStorage.setItem('rememberMe','')
    props.history.push('/');
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <span
        style={{ color: '#343a40', fontSize: '1.25rem', marginRight: '2.5rem' }}
      >
        <b>회원 탈퇴</b>
      </span>
      <Popconfirm
        title="탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다."
        onConfirm={onUserDeleteClick}
        okText="예"
        cancelText="아니오"
      >
        <Button  type="danger">
          회원 탈퇴
        </Button>
      </Popconfirm>
      <p style={{ marginTop: '0.5rem', color: '#868e96' }}>
        탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
      </p>
    </div>
  );
}

export default withRouter(DeletePage);
