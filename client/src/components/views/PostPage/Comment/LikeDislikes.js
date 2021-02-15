import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);


  let variable = {}

    if(props.postId){
        variable ={postId : props.postId , userId : props.userId}
    }else {
        variable = {commentId : props.commentId, userId : props.userId}
    }

  useEffect(() => {

    axios.post('/api/like/getLikes', variable).then((response) => {
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

    axios.post('/api/like/getDislikes', variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);

        //내가 이미 싫어요를 눌렀는지

        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('싫어요 가져오기 실패!');
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
      axios.post('/api/like/upLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked');

          if (DislikeAction !== null) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          }
        } else {
          alert('좋아요 누르기 실패!');
        }
      });
    } else {
      axios.post('/api/like/unLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert('싫어요 누르기 실패!');
        }
      });
    }
  };

  const onDislike = () => {
    if (localStorage.getItem('userId') === '') {
      return (
        message.error('싫어요 기능은 로그인 후 사용할 수 있습니다'),
        props.history.push('/login')
      );
    }

    if (DislikeAction === null) {
      axios.post('/api/like/upDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked');

          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert('싫어요 누르기 실패');
        }
      });
    } else {
      axios.post('/api/like/unDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikeAction(null);
          setDislikes(Dislikes - 1);
        } else {
          alert('싫어요 누르기 실패');
        }
      });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ paddingRight: '15px' }}>
        <span key="comment-basic-like">
          <Tooltip title="Like">
            {LikeAction === 'liked' ? (
              <Icon type="like" theme="filled" onClick={onLike} />
            ) : (
              <Icon type="like" theme="outlined" onClick={onLike} />
            )}
          </Tooltip>
          <span style={{ paddingLeft: '8px', cursor: 'auto' }}>
            {Likes >= 0 ? Likes : 0}
          </span>
        </span>
      </div>

      <div>
        <span key="comment-basic-dislike">
          <Tooltip title="Dislike">
            {DislikeAction === 'disliked' ? (
              <Icon type="dislike" theme="filled" onClick={onDislike} />
            ) : (
              <Icon type="dislike" theme="outlined" onClick={onDislike} />
            )}
          </Tooltip>
          <span style={{ paddingLeft: '8px', cursor: 'auto' }}>
            {Dislikes >= 0 ? Dislikes : 0}
          </span>
        </span>
      </div>
    </div>
  );
}

export default withRouter(LikeDislikes);
