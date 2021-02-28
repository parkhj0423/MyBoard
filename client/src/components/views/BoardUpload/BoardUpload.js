import React, { useState } from 'react';
import { Button, message, Select } from 'antd';
import Editor from '../Commons/Editor';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import './BoardUpload.css';


const { Option } = Select;
function BoardUpload(props) {
  const [Content, setContent] = useState('');
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Files, setFiles] = useState([]);
  const [Tags, setTags] = useState('');
  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onEditorChange = (value) => {
    setContent(value);
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };
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
      description: Description,
      text: Content,
      tags: Tags,
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

  function handleChange(value) {
    console.log(`selected ${value}`);
    setTags(value);
  }
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
      <div className="group">
        <input type="text" required value={Title} onChange={onTitleChange} />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Title</label>
      </div>

      <div className="group">
        <input
          type="text"
          required
          value={Description}
          onChange={onDescriptionChange}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Description</label>
      </div>


      <Select

        mode="multiple"
        allowClear
        style={{ width: '300px' }}
        placeholder="Select Tags"
        onChange={handleChange}
      >
        <Option key="Tech">Tech</Option>
        <Option key="Daily">Daily</Option>
        <Option key="Food">Food</Option>
        <Option key="Diary">Diary</Option>
      </Select>

      <br />
      <div style={{ width: '85%' }}>
        <Editor
          placeholder={'Start Posting Something'}
          onEditorChange={onEditorChange}
          onFilesChange={onFilesChange}
        ></Editor>
      </div>
      <br />
      <br />
      <br />
      <Button type="primary" onClick={onSubmitClick}>
        Save
      </Button>
    </div>
  );
}

export default withRouter(BoardUpload);
