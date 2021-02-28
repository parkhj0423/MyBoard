import React, { useState } from 'react';
import { Comment, Avatar, Button, message, Icon } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
  const [CommentValue, setCommentValue] = useState('');
  const [OpenReply, setOpenReply] = useState(false);

  const user = useSelector((state) => state.user);

  const handleClick = (event) => {
    const value = event.currentTarget.value;
    setCommentValue(value);
  };

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    let variable = {
      text: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    axios.post('/api/comment/saveComment', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue('');
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글 저장 실패!');
      }
    });
  };

  const deleteComment = () => {
    let variables = {
      text: props.comment.text,
      writer: localStorage.getItem('userId'),
      postId: props.postId,
    };

    if (props.comment.writer._id === localStorage.getItem('userId')) {
      axios.post('/api/comment/deleteComment', variables).then((response) => {
        if (response.data.success) {
          message.success('댓글 삭제 성공!');
          window.location.reload();
        } else {
          alert('댓글 삭제 실패!');
        }
      });
    } else {
      message.error('본인의 댓글만 지울 수 있습니다!');
    }
  };

  const actions = [
    <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
    <span
      style={{ paddingLeft: '15px', cursor: 'pointer' }}
      onClick={onClickReplyOpen}
      key="comment-basic-reply-to"
    >
      Reply to
    </span>,
    <Icon type="delete" theme="filled" onClick={deleteComment} />,
  ];

  

  return (
    <div>
      {props.comment.writer && (
        <Comment
          actions={actions}
          author={<a href={`/mypage/${props.comment.writer._id}`}><h3>{props.comment.writer.name}</h3></a>}
          avatar={<a href={`/mypage/${props.comment.writer._id}`}><Avatar src={props.comment.writer.image} alt="avatarImage" /></a>}
          content={<p>{props.comment.text}</p>}
        />
      )}
      {OpenReply && (
        <div className="group" style={{ width: '100%' }}>
        <input
          style={{ width: '100%' }}
          type="text"
          required
          value={CommentValue}
          onChange={handleClick}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Comment</label>
        <Icon
          className="submitIcon"
          type="arrow-right"
          theme="outlined"
          style={{ fontSize: '30px', cursor: 'pointer' }}
          onClick={onSubmit}
        />
      </div>
      )}
    </div>
  );
}

export default withRouter(SingleComment);
