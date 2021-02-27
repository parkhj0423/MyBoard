import React, { useState } from 'react';
import Axios from 'axios';
import { Button, message, Card, Avatar } from 'antd';
import './UploadImage.css';

const { Meta } = Card;

function UploadImage(props) {
  const [ToggleSubmit, setToggleSubmit] = useState(false);
  const [content, setContent] = useState('');
  const [PreviewSource, setPreviewSource] = useState();

  const onChange = (e) => {
    console.log(e.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
    setContent(e.target.files[0]);
  };

  const onInsertImageClick = () => {
    setToggleSubmit(!ToggleSubmit);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!PreviewSource) {
      setToggleSubmit(!ToggleSubmit);
      return message.error('이미지를 선택해주세요');
    }

    Axios.post('/api/users/uploadImage', {
      method: 'POST',
      data: PreviewSource,
    }).then((response) => {
      if (response.data.success) {
        message.success('Success to uploadImage');
        console.log(response.data.url);

        Axios.post('/api/users/setProfileImage', {
          _id: localStorage.getItem('userId'),
          image: response.data.url,
        }).then((response) => {
          if (response.data.success) {
            console.log(response.data.result);
            message.success('Success to setProfileImage');
          } else {
            message.error('Failed to setProfileImage');
          }
        });
      } else {
        message.error('Failed to uploadImage');
      }
    });

    setToggleSubmit(!ToggleSubmit);
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
            onClick={onInsertImageClick}
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
      {content.name && (
        <p style={{ margin: '0' }}>
          <b>선택한 파일 : {content.name}</b>
        </p>
      )}

      {ToggleSubmit && (
        <form encType="multipart/form-data" method="post" onSubmit={onSubmit}>
          <Button
            type="default"
            style={{ marginTop: '1rem', width: '128px' }}
            onClick={onSubmit}
          >
            이미지 업로드
          </Button>
        </form>
      )}
    </div>
  );
}

export default UploadImage;
