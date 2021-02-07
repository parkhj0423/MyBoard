import React from 'react'
import {Icon} from 'antd';

function Footer() {
    return (
        <div style={{
            width:'100%',
            height: '80px',
            textAlign:'center',
            borderTop:'1px solid #e5e5e5',
            fontSize:'1rem'
        }}>
           <p>MyBoard  <Icon type="fire" theme='filled' /></p>
        </div>
    )
}

export default Footer
