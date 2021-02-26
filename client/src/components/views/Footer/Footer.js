import React from 'react';
import { Icon } from 'antd';

function Footer() {
  return (
    <div
      style={{
        width: '100%',
        height: '80px',
        textAlign: 'center',
        borderTop: '1px solid #e5e5e5',
        fontSize: '0.75rem',
      }}
    >
      <div style={{marginTop:'0.5rem'}}>
        <Icon type="mail" theme="filled" /> parkhj0423@naver.com
        <br />
        <a href='https://github.com/parkhj0423'><Icon type="github" theme="filled" style={{ fontSize: '2rem',color:'black' }} /></a>
      </div>
    </div>
  );
}

export default Footer;
