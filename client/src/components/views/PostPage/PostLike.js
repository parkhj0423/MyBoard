import React, { useEffect, useState } from 'react';
import { Icon, message } from 'antd';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
function PostLike(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);

  let variable = {};

  if (props.postId) {
    variable = { postId: props.postId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);

        //내가 이미 좋아요를 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('좋아요 가져오기 실패!');
      }
    });
  }, []);

  const onLike = () => {
    if (localStorage.getItem('userId') === '') {
      return (
        message.error('좋아요 기능은 로그인 후 사용할 수 있습니다'),
        props.history.push('/login')
      );
    }

    if (LikeAction === null) {
      Axios.post('/api/like/upLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked');
          //해당 포스트에 좋아요 수 업로드
          Axios.post('/api/post/setPostLikeNumber', {
            _id: props.postId,
            likes: Likes + 1,
          }).then((response) => {
            if (response.data.success) {
              
            } else {
              message.error('좋아요 수 업로드 실패');
            }
          });
        } else {
          alert('좋아요 누르기 실패!');
        }
      });
    } else {
      Axios.post('/api/like/unLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
          //해당 포스트에 좋아요 수 업로드
          Axios.post('/api/post/setPostLikeNumber', {
            _id: props.postId,
            likes: Likes - 1,
          }).then((response) => {
            if (response.data.success) {
              
            } else {
              message.error('좋아요 수 업로드 실패');
            }
          });
        } else {
          alert('싫어요 누르기 실패!');
        }
      });
    }
  };

  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <Icon
        type="heart"
        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
        onClick={onLike}
        style={{ fontSize: '2.5rem' }}
      />
      {Likes} 개의 좋아요
    </div>
  );
}

export default withRouter(PostLike);
