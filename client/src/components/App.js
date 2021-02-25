import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import BoardUpload from './views/BoardUpload/BoardUpload';
import PostPage from './views/PostPage/PostPage';
import BoardModify from './views/BoardModify/BoardModify';
import SearchPage from './views/SearchPage/SearchPage'
import MyPage from './views/MyPage/MyPage'
import TagsPage from './views/TagsPage/TagsPage';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/upload" component={Auth(BoardUpload, true)} />
          <Route exact path="/search" component={Auth(SearchPage, null)} />
          <Route exact path="/board/:postId" component={Auth(PostPage, null)} />
          <Route exact path="/modify/:postId" component={Auth(BoardModify, null)} />
          <Route exact path="/mypage" component={Auth(MyPage, true)} />
          <Route exact path="/tags/:tags" component={Auth(TagsPage, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
