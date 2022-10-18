// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { DDPClient } from './ddpClient';

import './meteor/meteor';
import './meteor/tracker';
import './meteor/random';
import './meteor/diff-sequence';
import './meteor/ordered-dict';
import './meteor/mongo-id';
import './meteor/id-map';
import './meteor/geojson-utils';
import './meteor/minimongo';
import './meteor/reactive-var';
import './meteor/check';
import './meteor/mongo';
import './meteor/ddp';
import './meteor/reload';
import './meteor/retry';


import './client/styles/_ROOT.scss'

import './client/main'


// const ddp = new DDPClient({
//   host: 'localhost',
//   port: 3000,
//   debug: true
// });
// ddp.connect((err) => {
//   if (err){
//     console.error('Connection failed', err)
//   }
// });

// (window as any).ddp = ddp


// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
