import { createGlobalStyle } from 'styled-components';
import { Colors } from 'constants/index';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${Colors.dark};
  }

  a  {
    display: inline-block;
    text-decoration: none;
    color: inherit;
    height: fit-content;
  }

  img{
    width: 100%;
    height: auto;
    max-width: 600px;
  }

  iframe {
    display: block;
    width: 100%;
    max-width: 600px;
    height: 300px;
  }
`;
