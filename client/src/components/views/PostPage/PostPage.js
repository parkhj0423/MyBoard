import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Axios from 'axios';
import { Icon, Tag } from 'antd';
const { Title } = Typography;

function PostPage(props) {
  const postId = props.match.params.postId;
  const [Post, setPost] = useState([]);
  console.log(postId);
  useEffect(() => {
    let variable = {
      postId: postId,
    };
    Axios.post('/api/post/getDetailPost', variable).then((response) => {
      if (response.data.success) {
        setPost(response.data.result);
        console.log(response.data.result);
        for (let key in response.data.result.tags) {
          console.log(response.data.result.tags[key]);
        }
      } else {
        alert('글 가져오기 실패');
      }
    });
  }, []);

  const onModifyClick = (event) => {
    event.preventDefault();
  };

  if (Post.writer) {
    let postCreatedDate = Post.createdAt.substring(0, 10);
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
          <Title level={2}>{Post.writer.name}`s Today</Title>
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
          {/* {Post.writer._id && localStorage.getItem('userId')} */}

          <a href={`/modify/${postId}`} property={Post}>
            <Icon type="edit" theme="filled" style={{ fontSize: '35px' }} />
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <p style={{ fontSize: '12px' }}>{postCreatedDate} 에 작성됨</p>
        </div>

        <hr />

        <br />
        <div dangerouslySetInnerHTML={{ __html: Post.text }} />
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

export default PostPage;
