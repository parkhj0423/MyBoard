import React, { useState, useEffect } from 'react';
import {Button, message, Select } from 'antd';
import Editor from '../Commons/Editor';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
const { Option } = Select;
function BoardModify(props) {
  const postId = props.match.params.postId;

  const [Content, setContent] = useState('');
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [ setFiles] = useState([]);
  const [ModifyPost, setModifyPost] = useState([]);
  const [Tags, setTags] = useState('');
  useEffect(() => {
    let variable = {
      postId: postId,
    };
    Axios.post('/api/post/getDetailPost', variable).then((response) => {
      if (response.data.success) {
        setModifyPost(response.data.result);
        setContent(response.data.result.text);
      } else {
        alert('글 가져오기 실패');
      }
    });
  }, []);

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
    console.log(Title);
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
  function handleChange(value) {
    console.log(`selected ${value}`);
    setTags(value);
  }

  const onSubmitClick = (event) => {
    event.preventDefault();
    if (Title.trim() === '') {
      message.error('제목을 입력해주세요');
      return;
    }

    if (Content.trim() === '') {
      message.error('내용을 입력해주세요');
      return;
    }
    let variable = {
      postId: postId,
      title: Title,
      description: Description,
      text: Content,
      tags: Tags,
    };
    Axios.post('/api/post/modifyPost', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        message.success('Success to modify Post!!');
        props.history.push(`/board/${postId}`);
      } else {
        message.error('Failed to modfiy Post');
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
      <div className="group">
        <input type="text"  value={Title ? Title : ModifyPost.title} onChange={onTitleChange} />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Title</label>
      </div>

      <div className="group">
        <input
          type="text"
          required
          value={Description ? Description : ModifyPost.description}
          onChange={onDescriptionChange}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Description</label>
      </div>






      <Select
        mode="multiple"
        allowClear
        style={{ width: '25%' }}
        placeholder="Select Tags"
        onChange={handleChange}
        defaultValue={'Tech'}
      >
        <Option key="Tech">Tech</Option>
        <Option key="Daily">Daily</Option>
        <Option key="Food">Food</Option>
        <Option key="Diary">Diary</Option>
      </Select>
      <br />
      <div style={{ width: '50%' }}>
        <Editor
          placeholder={'Start Posting Something'}
          onEditorChange={onEditorChange}
          onFilesChange={onFilesChange}
          textValue={ModifyPost.text}
        ></Editor>
      </div>
      <br />

      <br />
      <Button type="default" onClick={onSubmitClick}>
        Save
      </Button>
    </div>
  );
}

export default withRouter(BoardModify);
