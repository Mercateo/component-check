import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import ExampleApp from './example-app';

const store = createStore(reducers);

render(
  <Provider store={store}>
    <ExampleApp />
  </Provider>,
  document.getElementById('example-app')
);
