import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';
import App from './App';
import { HashRouter } from 'react-router-dom';
import './assets/base.css';
import Main from './DemoPages/Main';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';

const  store = configureStore();
const  rootElement = document.getElementById('root');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


//ReactDOM.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//  document.getElementById('root')
//);


const renderApp = Component => {
  ReactDOM.render(
   <Provider store={store}>
      <HashRouter>
        <Component />
	<App />

      </HashRouter>
   </Provider>,
    rootElement
  );
};

renderApp(Main);

if (module.hot) {
  module.hot.accept('./DemoPages/Main', () => {
    const NextApp = require('./DemoPages/Main').default;
    renderApp(NextApp);
  });
	
}

unregister();

// registerServiceWorker();
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
