import React, { useState } from 'react';
import Axios from 'axios';
import { Button, message, Card, Avatar } from 'antd';
import './UploadImage.css';
const { Meta } = Card;


function UploadImage(props) {
  const [ToggleSubmit, setToggleSubmit] = useState(false);
  const [content, setContent] = useState('');

  const [uploadedImg, setUploadedImg] = useState({
    fileName: '',
    fillPath: '',
  });

  const onChange = (e) => {
    setContent(e.target.files[0]);
  };

  const onInsertImageClick = () => {
    setToggleSubmit(!ToggleSubmit);
  };

  const onSubmit = (e) => {
    if (content === '') {
      message.error('이미지를 선택해주세요');
    } else {
      const formData = new FormData();
      formData.append('file', content);
      Axios.post('/api/users/uploadImage', formData)
        .then((response) => {
          const { fileName } = response.data;
          console.log(fileName);

          setUploadedImg({
            fileName,
            filePath: `${PAGE_URL}uploads/${fileName}`,
          });

          Axios.post('api/users/setImage', {
            _id: localStorage.getItem('userId'),
            image: `${PAGE_URL}uploads/${fileName}`,
          }).then((response) => {
            if (response.data.success) {
              console.log(response.data.result);
              message.success('Success to setImage');
            } else {
              message.error('Failed to setImage');
            }
          });
          message.success('The file is successfully uploaded');
        })
        .catch((err) => {
          console.error(err);
        });
      setToggleSubmit(!ToggleSubmit);
    }
  };

  return (
    <div>
      <Meta
        avatar={
          <Avatar
            src={
              uploadedImg.filePath === undefined
                ? props.MyProfile.image
                : uploadedImg.filePath
            }
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
        <Button
          type="default"
          style={{ marginTop: '1rem', width: '128px' }}
          onClick={onSubmit}
        >
          이미지 업로드
        </Button>
      )}
    </div>
  );
}

export default UploadImage;
