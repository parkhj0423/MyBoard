import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Tag, message, List, Empty } from 'antd';
import DeletePage from '../DeletePage/DeletePage';
import UploadImage from './UploadImage';
import ModifyProfile from './ModifyProfile';
import './MyProfileMedia.css'
function MyPage(props) {
  const userId = props.match.params.userId;

  const [MyPostList, setMyPostList] = useState([]);
  const [MyProfile, setMyProfile] = useState([]);

  useEffect(() => {
    let variable = {
      writer: userId,
    };
    Axios.post('/api/post/getPost', variable).then((response) => {
      if (response.data.success) {
        setMyPostList(response.data.result);
      } else {
        message.error('Failed to get Posts!');
      }
    });

    Axios.post('/api/users/getUserInfo', {
      _id: userId,
    }).then((response) => {
      if (response.data.success) {
        setMyProfile(response.data.result[0]);
      } else {
        message.error('Failed to get UserInfo');
      }
    });
  }, []);

  const renderMyPost = MyPostList.map((list, index) => {
    let imageUrl = '';
    const textSplit = list.text.split('<img src="')[1];
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
          <div style={{maxWidth:'300px'}}>
            <a href={`/board/${list._id}`}>
              <img
                style={{ width: '100%', height: '167px' }}
                alt="thumbnail"
                src={
                  imageUrl
                    ? imageUrl
                    : 'https://media.giphy.com/media/l3vRdNUR4XPpRoPmM/giphy.gif'
                }
              />
            </a>
          </div>
          <div style={{ margin: '2rem 0 0 2rem' }}>
            <List.Item.Meta
              avatar={<Avatar src={list.writer.image} />}
              title={
                <a href={`/board/${list._id}`}>
                  <h2>
                    <b>{list.title}</b>
                  </h2>
                </a>
              }
              description={<h4>{list.writer.name}</h4>}
            />
            <h3 style={{ color: ' ' }}>{list.description}</h3>
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
    <div style={{ width: '70%', margin: '0 auto' }}>
      <div
      className='myProfile'
        style={{ margin: '5rem 0', display: 'flex', justifyContent: 'center',alignItems:'center' }}
      >
        <div>
          {/* 프로필 사진 이미지 업로드 컴포넌트 */}
          <UploadImage MyProfile={MyProfile} />
        </div>
        <div
          style={{
            marginLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 이름, 한 줄 소개 수정 컴포넌트 */}
          <ModifyProfile MyProfile={MyProfile} />
        </div>
      </div>
       
      <hr />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '30px',
          background: '#faf7f7',
          borderRadius: '20px',
        }}
      >
        {/* 배열이 빈 배열인지 체크하고 분기  */}
        {Array.isArray(MyPostList) && MyPostList.length === 0 ? (
          <div style={{ background: '#fff' }}>
            <Empty />
            <p
              style={{
                textAlign: 'center',
                color: '#868e96',
                fontSize: '2rem',
                margin: '2rem 0',
              }}
            >
              아직 포스트가 없습니다
            </p>
          </div>
        ) : (
          <React.Fragment>
            <h3 style={{ textAlign: 'center' }}>
              {MyPostList.length}개의 포스트가 있습니다
            </h3>
            <br />
            {renderMyPost}
          </React.Fragment>
        )}
      </div>
      {/* 회원 탈퇴를 위한 컴포넌트 */}
      {MyProfile._id === localStorage.getItem('userId') && <DeletePage />}
    </div>
  );
}

export default withRouter(MyPage);
