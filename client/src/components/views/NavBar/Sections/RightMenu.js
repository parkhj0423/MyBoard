/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { message } from 'antd';
import './Button.css';
function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const [MyPageProfile, setMyPageProfile] = useState('');
  useEffect(() => {
    let variable = {
      _id: localStorage.getItem('userId'),
    };
    if (localStorage.getItem('userId') !== '') {
      Axios.post('/api/users/getUserInfo', variable).then((response) => {
        if (response.data.success) {
          setMyPageProfile(response.data.result[0]);
        } else {
          message.error('Failed to getInfo');
        }
      });
    }
  }, []);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push('/login');
        localStorage.setItem('userId', '');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">
            <div id="container">
              <button className="learn-more">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">로그인</span>
              </button>
            </div>
          </a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">
            <div id="container">
              <button className="learn-more">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">회원 가입</span>
              </button>
            </div>
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        {user.userData && (
          <Menu.Item key="myPage">
            <a href={`/mypage/${localStorage.getItem('userId')}`}>
              <img
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '20px',
                }}
                src={MyPageProfile.image}
                alt="MyPageImage"
              />
            </a>
          </Menu.Item>
        )}
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>
            <div id="container">
              <button className="learn-more">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">로그 아웃</span>
              </button>
            </div>
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
