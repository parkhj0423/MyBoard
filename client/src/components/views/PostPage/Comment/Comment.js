import React, { useState } from 'react';
import { useSelector } from 'react-redux'; //useSelector 는 redux hook임... react에서 import 하는거아님...
import { Typography, message, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { Title } = Typography;

function Comment(props) {
  const [CommentValue, setCommentValue] = useState('');
  const user = useSelector((state) => state.user);
  const postId = props.postId;

  const handleClick = (event) => {
    if (user.userData._id) {
      const value = event.currentTarget.value;
      setCommentValue(value);
    } else {
      message.error('댓글은 로그인 후 작성 가능합니다.');
      props.history.push('/login');
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    let variables = {
      text: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
    };

    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글 저장 실패!');
      }
    });
    setCommentValue('');
  };

  return (
    <div>
      <div>
        <br />
        <Title level={4}>Replies</Title>
        <hr />

        {/* commments Lists */}

        {props.commentLists &&
          props.commentLists.map(
            (comment, index) =>
              !comment.responseTo && (
                <div key={index}>
                  <SingleComment
                    refreshFunction={props.refreshFunction}
                    comment={comment}
                    postId={postId}
                    commentLists={props.commentLists}
                  />
                  <ReplyComment
                    refreshFunction={props.refreshFunction}
                    parentCommentId={comment._id}
                    postId={postId}
                    commentLists={props.commentLists}
                  />
                </div>
              ),
          )}

        {/* Root comment Form */}

        <div className="group" style={{ width: '100%',marginTop:'30px' }}>
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
      </div>
    </div>
  );
}

export default withRouter(Comment);
