import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Avatar, Tag, message, List } from 'antd';

function TagsPage(props) {
  const tag = props.match.params.tags;
  const [PostList, setPostList] = useState([]);

  useEffect(() => {
    Axios.post('/api/post/getPost').then((response) => {
      if (response.data.success) {
        setPostList(response.data.result);

        // for (let key in response.data.result) {
        //   console.log(response.data.result[key].tags);
        // }
      } else {
        message.error('검색 실패');
      }
    });
  }, []);

  const tagFilter = PostList.filter((list, index) => {
    return list.tags.includes(tag);
  });
  console.log(tagFilter);

  const renderTag = tagFilter.map((list, index) => {
    let imageUrl = '';
    const textSplit = list.text.split('src="')[1];
    if (textSplit !== undefined) {
      imageUrl = textSplit.split('"')[0];
    }
    return (
      <List key={index} itemLayout="horizontal">
        <List.Item
          style={{
            display: 'flex',
            width: '80%',
            margin: '0 auto',
            justifyContent: 'flex-start',
          }}
        >
          <a href={`/board/${list._id}`}>
            <img
              style={{ width: '300px', height: '167px' }}
              alt="thumbnail"
              src={
                imageUrl
                  ? imageUrl
                  : 'https://media.giphy.com/media/l3vRdNUR4XPpRoPmM/giphy.gif'
              }
            />
          </a>
          <div style={{ marginLeft: '2rem' }}>
            <List.Item.Meta
              avatar={<Avatar src={list.writer.image} />}
              title={
                <a href={`/board/${list._id}`}>
                  <h2>
                    <b>{list.title}</b>
                  </h2>
                </a>
              }
              description={<h3>{list.writer.name}</h3>}
            />
            <h3 style={{ color: '#868e96' }}>{list.description}</h3>
            {list.tags.map((tags, index) => {
              const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
              return (
                <Tag color={colors[index]} key={index}>
                  <a href={`/tags/${tags}`}>{tags}</a>
                </Tag>
              );
            })}
          </div>
        </List.Item>
      </List>
    );
  });
  return (
    <div style={{ width: '80%', margin: '5rem auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '4rem' }}># {tag}</h1>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '30px',
          background: '#faf7f7',
          borderRadius: '20px',
        }}
      >
        <React.Fragment>
          <h3 style={{ textAlign: 'center' }}>
            총 {tagFilter.length} 개의 포스트
          </h3>
          <br />
          {renderTag}
        </React.Fragment>
      </div>
    </div>
  );
}

export default TagsPage;
