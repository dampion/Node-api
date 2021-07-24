import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import Button from '../components/Button'
import UserForm from '../components/UserForm';

import { useMutation, useApolloClient, gql } from '@apollo/client';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 500px;
  padding: 1em;
  margin: 0 auto;
`;

const Form = styled.form`
  label,
  input {
    display: block;
    line-height: 2em;
  }

  input {
    width: 100%;
    margin-bottom: 1em;
  }
`;

const SIGNUP_USER = gql`
  mutation signUp ($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password)
  }
`

// 加入傳遞至元件的props以供稍後使用
const SignUp = props => {
  // 設定表單的預設狀態
  const [values, setValues] = useState();

  // // 在表單中輸入時更新狀態
  // const onChange = event => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   })
  // }

  useEffect(() => {
      // 更新文件標題
      document.title = 'Sign up - dampion';
  });

  // const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
  //   onCompleted: data => {
  //     // 變動完成時，對JSON網頁權杖進行
  //     // console.log(data.signUp);
  //     localStorage.setItem('token', data.signUp)
  //     props.history.push('/')
  //   }
  // });

  // Apollo Client
const client = useApolloClient();
// 變動勾點
const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
  onCompleted: data => {
    // restore token
    localStorage.setItem('token', data.signUp);
    // update local cache
    client.writeData({ data: { isLoggenIn: true }});
    // redirect to home
    props.history.push('/')
  }
})

  return (
    <React.Fragment>
      <UserForm action={signUp} formType="signup" />
      {/* if the data is loading, display a loading message*/}
      {loading && <p>Loading...</p>}
      {/* if there is an error, display a error message*/}
      {error && <p>Error creating an account!</p>}
    </React.Fragment>
  )
}

export default SignUp;