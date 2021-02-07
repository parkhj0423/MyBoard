import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import Editor from '../Commons/Editor';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

function BoardUpload(props) {
  const [Content, setContent] = useState('');
  const [Title, setTitle] = useState('');
  const [Files, setFiles] = useState([])

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
    console.log(Title);
  };

  const onEditorChange = (value) => {
    setContent(value);
  };

  const onFilesChange = (files) => {
    setFiles(files)
  }
  const onSubmitClick = (event) => {
    event.preventDefault();
    if (Title.trim() === '') {
      alert('제목을 입력해주세요');
      return;
    }

    if (Content.trim() === '') {
      alert('내용을 입력해주세요');
      return;
    }
    let variable = {
      writer: localStorage.getItem('userId'),
      title: Title,
      text: Content,
    };
    Axios.post('/api/post/savePost', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        message.success('글 등록 성공!');
        props.history.push('/');
      } else {
        alert('post 저장 실패!');
      }
    });
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '100px 20px',
      }}
    >
      <Input
        style={{ width: '200px' }}
        placeholder="Title"
        value={Title}
        onChange={onTitleChange}
      />
      <br />
      <Editor
        placeholder={'Start Posting Something'}
        onEditorChange={onEditorChange}
        onFilesChange={onFilesChange}
      ></Editor>
      <br />
      <br />
      <br />
      <Button type="default" onClick={onSubmitClick}>
        Save
      </Button>
    </div>
  );
}

export default withRouter(BoardUpload);
