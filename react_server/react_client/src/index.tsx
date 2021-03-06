import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd-mobile/dist/antd-mobile.css'; // or 'antd-mobile/dist/antd-mobile.less'
import 'react-loading-skeleton/dist/skeleton.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

console.log('NODE_ENV : ', process.env.REACT_APP_NODE_ENV);
