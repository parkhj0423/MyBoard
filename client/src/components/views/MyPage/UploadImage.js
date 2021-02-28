import React, { useState } from 'react';
import Axios from 'axios';
import { Button, message, Card, Avatar } from 'antd';
import './UploadImage.css';

const { Meta } = Card;

function UploadImage(props) {
  const [PreviewSource, setPreviewSource] = useState();

  const onChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      Axios.post('/api/users/uploadImage', {
        method: 'POST',
        data: reader.result,
      }).then((response) => {
        if (response.data.success) {
          message.success('Success to uploadImage');
          Axios.post('/api/users/setProfileImage', {
            _id: localStorage.getItem('userId'),
            image: response.data.url,
          }).then((response) => {
            if (response.data.success) {
              message.success('Success to setProfileImage');
              window.location.reload();
            } else {
              message.error('Failed to setProfileImage');
            }
          });
        } else {
          message.error('Failed to uploadImage');
        }
      });
    };
  };

  return (
    <div>
      <Meta
        avatar={
          <Avatar
            src={PreviewSource ? PreviewSource : props.MyProfile.image}
            style={{ width: '128px', height: '128px' }}
          />
        }
      />
      {props.MyProfile._id === localStorage.getItem('userId') && (
        <div
          className="filebox bs3-success"
          style={{ position: 'relative', marginTop: '1rem' }}
        >
          <input
            id="input_image"
            type="file"
            onChange={onChange}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="input_image"
            style={{ width: '128px', textAlign: 'center' }}
          >
            이미지 선택
          </label>
        </div>
      )}
    </div>
  );
}

export default UploadImage;
