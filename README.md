# **🌈Welcome to [jujeory](https://jujeory.herokuapp.com/)!!**



## **⚡사용된 기술 스택**


|Frontend|Backend|DB|
|:---:|:---:|:---:|
|`React`|`Node.js` , `Express`| `Mongo DB`|
|<img src='https://media.vlpt.us/images/hyundong_kk/post/d44d940d-344b-4bcf-8980-52b66265add2/Ekran-Resmi-2019-11-18-18.08.13.png' alt='react' width='60px' height='40px'/>|<img src='https://res.cloudinary.com/practicaldev/image/fetch/s--_QMQU86---/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/6dnng3pre04xxdebia1g.png' alt='nodejs' width='60px' height='40px'> |<img src='https://media.vlpt.us/images/jinybear/post/3927e61f-29df-45aa-be01-40dc3ad966d0/1_Ta4qktHtO--RMUpnR08mBg.jpeg' alt='mongodb' width='80px' height='40px'>

<br>

💧 완벽하지 못한 상태에서 배포를 해서 수정해야할 부분과 버그 및 오류가 적지않은 상태입니다<br>

**💧 지속적인 유지보수와 코드 리팩토링으로 개선해 나가겠습니다**
<br><br><br>

---
## ⚡설치 방법
1. make `dev.js` file inside config folder 
2. put `mongoDB` info into `dev.js` file 
3. Type  " `npm install` " inside the root directory<br>( Download Server Dependencies ) 
4. Type " `npm install` " inside the client directory<br> ( Download Front-end Dependencies )


---
## **2021-03-02**

### 🌪 발견된 오류와 버그

<br>

현재 **대부분의 오류는 글 수정 버튼을 통해 작성된 글을 수정하는 과정**에서 나타나고 있습니다. 
<br>
`quill.js` 라이브러리를 통해서 `quill` 에디터를 사용하고 있는데 좀더 쓰기 편한 `WYSIWYG` 에디터로 교체할 예정입니다

- 글 수정버튼을 눌렀을 시 바로 작성했던 글을 불러올 수 있지만 더 이상 타이핑이 안된다 <br>(Load 버튼을 따로 만들어 버튼을 클릭 시 불러오는 방법으로 임시 수정했지만 사용하기 불편)

- 글 수정 버튼을 눌렀을 시 `Title` 과 `Description`을 수정하지 않으면 제목을 입력하세요 오류가 뜬다

- 글 수정 버튼을 누르고 이미지를 추가적으로 삽입시 오류가 뜬다 


