import React, { useState, useEffect } from 'react';
import { Input, Button, message,Select } from 'antd';
import Editor from '../Commons/Editor';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
const {Option} = Select
function BoardModify(props) {
  const postId = props.match.params.postId;

  const [Content, setContent] = useState('');
  const [Title, setTitle] = useState('');
  const [Files, setFiles] = useState([]);
  const [ModifyPost, setModifyPost] = useState([]);
  const [Tags, setTags] = useState('')
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

  const onEditorChange = (value) => {
    setContent(Content.concat(value));
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };
  function handleChange(value) {
    console.log(`selected ${value}`);
    setTags(value)
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
      tags: Tags
    };
    Axios.post('/api/post/savePost', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        message.success('글 수정 성공!');
        props.history.push(`/board/${postId}`);
      } else {
        alert('글 수정 실패!');
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
        style={{ width: '300px' }}
        placeholder="Title"
        value={Title ? Title : ModifyPost.title}
        onChange={onTitleChange}
      />
      <br />
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
      <br/>
      <div style={{width:'80%'}}>
        <Editor
          placeholder={'Start Posting Something'}
          onEditorChange={onEditorChange}
          onFilesChange={onFilesChange}
          textValue={ModifyPost.text}
        ></Editor>
      </div>
      <br />
      <div>{ModifyPost.text}</div>
      <br />
      <br />
      <Button type="default" onClick={onSubmitClick}>
        Save
      </Button>
      <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
        <div dangerouslySetInnerHTML={{ __html: ModifyPost.text }} />
      </div>
    </div>
  );
}

export default withRouter(BoardModify);
