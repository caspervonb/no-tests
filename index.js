'use strict';

const createStore = require('redux').createStore;
const Provider = require('react-redux').provider;
const React = require('react');
const render = require('react-dom').render;
const connect = require('react-redux').connect;

class Test extends React.Component {
 render() {
   return (
     <li onClick={this.props.onClick}>
       {this.props.description}
     </li>
   );
 }
}

class TestList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.tests.map((test, index) =>
          <Test {...test} key={index} />
        )}
      </ul>
    );
  }
}

class App extends React.Component {
 render() {
   return (
     <div>
       <TestList tests={tests} />
     </div>
   );
  }
}

App = connect(function(state) {
  return {
    tests: [],
  };
})(App);

const ADD_TEST = 'ADD_TEST';
const FAIL_TEST = 'FAIL_TEST';
const SUCCEED_TEST = 'SUCCEED_TEST';

const TEST_STATE_PENDING = 0;

function addTest(description, fn) {
  return {type: ADD_TEST, description, fn};
}

function failTest(description, fn) {
  return {type: RUN_TEST, description, fn, state: TEST_STATE_PENDING };
}

function

let store = createStore(function reduce(state, action) {
  switch (action.type) {
    case ADD_TEST:
      return [
        ...state,
        {
          description: action.description,
        }
      ];

    break;
  }

  return state;
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
