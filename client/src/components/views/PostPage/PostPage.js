import React, { useEffect, useState } from 'react';
import {Typography} from 'antd'
import Axios from 'axios';

const {Title} = Typography

function PostPage(props) {
  const postId = props.match.params.postId;
  const [Post, setPost] = useState([])

  useEffect(() => {
    let variable = {
      postId: postId,
    };
    Axios.post('/api/post/getDetailPost', variable).then((response) => {
      if (response.data.success) {
        setPost(response.data.result)
        console.log('postList', Post);
      } else {
        alert('글 가져오기 실패');
      }
    });
  }, []);

  if (Post.writer) {
    return (
      <div className="postPage" style={{ width: '80%', margin: '3rem auto' }}>
        <Title level={2}>{Post.writer.name}`s Post</Title>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Title level={4}>{Post.createdAt}</Title>
        </div>
        <div dangerouslySetInnerHTML={{ __html: Post.text }} />
      </div>
    );
  } else {
    return <div style={{ width: '80%', margin: '3rem auto' }}>loading...</div>;
  }
}

export default PostPage;
