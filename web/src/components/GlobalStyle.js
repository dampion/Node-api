// import createGlobalStyle and normalize
import { createGlobalStyle } from 'styled-components';
import normalize from 'normalize.css';

// 我們可將css寫成js範本常值
export default createGlobalStyle`
  ${normalize}

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body,
  html {
    height: 100%;
    margin: 0;
  }

  body {
    background-color: #FFF;
    line-height: 1.4;
  }

  a:link,
  a:visited {
    color: #004499;
  }

  code,
  pre {
    max-width: 100%;
  }
`;