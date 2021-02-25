/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { message } from 'antd';

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const [MyPageProfile, setMyPageProfile] = useState('');
  useEffect(() => {
    let variable = {
      _id: localStorage.getItem('userId'),
    };
    Axios.post('/api/users/getUserInfo', variable).then((response) => {
      if (response.data.success) {
        setMyPageProfile(response.data.result[0]);
      } else {
        message.error('Failed to getInfo');
      }
    });
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
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        {user.userData && (
          <Menu.Item key="myPage">
            <a href='/mypage'>
              <img
                style={{ width: '30px', height: '30px', borderRadius: '20px' }}
                src={MyPageProfile.image}
                alt="MyPageImage"
              />
            </a>
          </Menu.Item>
        )}
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
