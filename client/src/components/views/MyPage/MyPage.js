import Axios from 'axios'
import React,{useEffect,useState} from 'react'
import {message} from 'antd'
function MyPage() {

    const [MyProfile, setMyProfile] = useState([])

    useEffect(() => {
        let variable = {
            writer : localStorage.getItem('userId')
        }
       Axios.post('/api/post/getPost',variable)
       .then(response => {
           if(response.data.success){
               setMyProfile(response.data.result)
               console.log(response.data.result)
           }else{
            message.error('Failed to get Posts!')
           }
       })

    }, [])



    return (
        <div>
            myPage
        </div>
    )
}

export default MyPage
