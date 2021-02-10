import React from 'react';
import { Pagination } from 'antd';

function pagination(props) {
  const { PostsPerPage, totalPosts,paginate } = props;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / PostsPerPage); i++) {
    pageNumbers.push(i);
  }
  const totalPage = PostsPerPage*pageNumbers.length

  const onPageChange = (page) => {
    paginate(page)
  };


  return (
    <Pagination
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
      }}
      defaultCurrent={1}
      total={totalPage}
      pageSize={PostsPerPage}
      onChange={onPageChange}
    ></Pagination>

  );
}

export default pagination;
