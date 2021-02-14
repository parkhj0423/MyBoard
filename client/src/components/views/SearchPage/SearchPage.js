import React, { useState, useEffect } from 'react';
import './SearchPage.css';

import { Avatar, Tag, message, List } from 'antd';
import Axios from 'axios';

function SearchPage() {
  const [SearchValue, setSearchValue] = useState('');
  const [PostList, setPostList] = useState([]);
  useEffect(() => {
    Axios.post('/api/post/getPost').then((response) => {
      if (response.data.success) {
        setPostList(response.data.result);
        console.log(response.data.result);
      } else {
        message.error('검색 실패');
      }
    });
  }, []);

  let searched = PostList.filter((list) => {
    return list.title.includes(SearchValue);
  });
  console.log(searched);

  const renderSearched = searched.map((list, index) => {
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
          <div>
            <List.Item.Meta
              avatar={<Avatar src={list.writer.image} />}
              title={
                <a href={`/board/${list._id}`}>
                  <h1>{list.title}</h1>
                </a>
              }
              description={<h4>{list.writer.name}</h4>}
            />
            {list.tags.map((tags, index) => {
              const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
              return (
                <Tag color={colors[index]} key={index}>
                  {tags}
                </Tag>
              );
            })}
          </div>
          <div style={{ marginLeft: '10px', textAlign: 'center' }}>
            <h3>
              <b>{list.description}</b>
            </h3>
          </div>
        </List.Item>
      </List>
    );
  });

  const onSearchChange = (event) => {
    setSearchValue(event.currentTarget.value);
  };

  return (
    <div style={{ width: '80%', margin: '100px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="search-box">
            <input
              type="text"
              placeholder="제목으로 검색"
              onChange={onSearchChange}
              value={SearchValue}
            />
            <span />
          </div>
        </div>
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
        {SearchValue && (
          <React.Fragment>
            <h3 style={{ textAlign: 'center' }}>
              총 {searched.length} 개의 포스트를 찾았습니다
            </h3>
            <br />
            {renderSearched}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
