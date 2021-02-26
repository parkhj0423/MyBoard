import React, { useState } from 'react';
import { Icon, message, Button } from 'antd';
import Axios from 'axios';

function ModifyProfile(props) {
  const { MyProfile } = props;
  const [Introduce, setIntroduce] = useState('');
  const [Name, setName] = useState('');
  const [ToggleModifyButton, setToggleModifyButton] = useState(false);

  const onIntroduceChange = (event) => {
    setIntroduce(event.currentTarget.value);
  };

  const onNameChange = (event) => {
    setName(event.currentTarget.value);
  };

  const onProfileSubmit = () => {
    // if (Name === '') {
    //   return message.error('이름을 입력하세요');
    // }
    if (Introduce === '') {
      return message.error('한 줄 소개를 입력하세요');
    }
    let variable = {};
    if (Name !== '') {
      variable = {
        _id: localStorage.getItem('userId'),
        introduce: Introduce,
        name: Name,
      };
    } else {
      variable = {
        _id: localStorage.getItem('userId'),
        introduce: Introduce,
      };
    }

    Axios.post('/api/users/modifyProfile', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        window.location.reload();
      } else {
        message.error('Failed to save introduce');
      }
    });
    setIntroduce('');
    setToggleModifyButton(!ToggleModifyButton);
  };

  const onModifyButtonClick = () => {
    setToggleModifyButton(!ToggleModifyButton);
  };

  return (
    <div>
      <div
        style={{
          fontSize: '3rem',
          color: '#343a40',
          margin: '0 1rem 1rem 1rem',
        }}
      >
        {ToggleModifyButton === false ? (
          MyProfile.name
        ) : (
          <div className="group" style={{ marginTop: '1rem' }}>
            <input type="text" required value={Name} onChange={onNameChange} />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>이름</label>
            <Icon
              className="submitIcon"
              type="arrow-right"
              theme="outlined"
              style={{ fontSize: '30px', cursor: 'pointer' }}
              onClick={onProfileSubmit}
            />
          </div>
        )}
      </div>

      {MyProfile.introduce && ToggleModifyButton === false ? (
        <div>
          <p style={{ color: '#868e96', fontSize: '1rem', margin: '1rem' }}>
            {MyProfile.introduce}
          </p>
        </div>
      ) : (
        <div className="group" style={{ margin: '1rem' }}>
          <input
            type="text"
            required
            value={Introduce}
            onChange={onIntroduceChange}
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>한 줄 소개</label>
          <Icon
            className="submitIcon"
            type="arrow-right"
            theme="outlined"
            style={{ fontSize: '30px', cursor: 'pointer' }}
            onClick={onProfileSubmit}
          />
        </div>
      )}
      {props.MyProfile._id === localStorage.getItem('userId') && (
        <div>
          {ToggleModifyButton ? (
            <div>
              <Button type="primary" onClick={onProfileSubmit}>
                저장
              </Button>
            </div>
          ) : (
            <Button type="default" onClick={onModifyButtonClick}>
              수정
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ModifyProfile;
