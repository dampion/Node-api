import React from 'react';
import styled from 'styled-components';
import logo from '../img/logo.svg';
import { useQuery, gql } from '@apollo/client';
import { Link, withRouter } from 'react-router-dom';
import ButtonAsLink from './ButtonAsLink'

// local check login
const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

const UserState = styled.div`
  margin-left: auto;
`
const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;

const Header = (props) => {
  // 使用者已登入狀態的查詢勾點
  // 包括參考 Apollo 商店的用戶端
  const { data, client } = useQuery(IS_LOGGED_IN);
  return (
    <HeaderBar>
      <img src={logo} alt="dampion logo" height="40" />
      <LogoText>dampion Note</LogoText>
      {/* 若以登入，則顯示登出連結，否則顯示登入選項 */}
      <UserState>
        {data.isLoggedIn ? (
          <ButtonAsLink
            onClick={() => {
              // remove token
              localStorage.removeItem('token');
              // remove應用程式cache
              client.resetStore();
              // 更新本機狀態
              client.writeData({ data: { isLoggedIn: false }});
              // redirect to home
              props.history.push('/')
            }}
          >Log out</ButtonAsLink>
        ) : (
          <p>
            <Link to={'/signin'}>Sign In</Link> or{' '}
            <Link to={'signup'}>Sign Up</Link>
          </p>
        )}
      </UserState>
    </HeaderBar>
  )
}

// 將元件包在withRouter高階元件
// 若要在本身無法直接路由的元件中加入路由 => withRouter
export default withRouter(Header);
