'use strict';

const createStore = require('redux').createStore;
const Provider = require('react-redux').Provider;
const React = require('react');
const render = require('react-dom').render;
const connect = require('react-redux').connect;

function generateTest() {
  var delay = 7000 + Math.random() * 7000;
  var testPassed = Math.random() > 0.5;

  return function(callback) {
    setTimeout(function() {
      callback(testPassed);
    }, delay);
  };
}

const tests = [
  { description: "commas are rotated properly",           run: generateTest() },
  { description: "exclamation points stand up straight",  run: generateTest() },
  { description: "run-on sentences don't run forever",    run: generateTest() },
  { description: "question marks curl down, not up",      run: generateTest() },
  { description: "semicolons are adequately waterproof",  run: generateTest() },
  { description: "capital letters can do yoga",           run: generateTest() },
];

class RunTests extends React.Component {
  render() {
    return (
      <div>
         <button onClick={e => this.handleClick(e)}>
           Run
         </button>
       </div>
     )
   }

   handleClick(e) {
     this.props.onRunClick();
   }
}

class Test extends React.Component {
 render() {
   return (
     <li onClick={this.props.onClick}>
      <span className="test-description">{this.props.description}</span>
      <span className="test-state"> {this.props.state}</span>
     </li>
   );
 }
}

class TestList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.tests.map((test, index) =>
          <Test {...test} key={index}
          onClick={() => this.props.onTestClick(index)} />
        )}
      </ul>
    );
  }
}

class App extends React.Component {
 render() {
   const dispatch = this.props.dispatch;

   return (
     <div>
      <RunTests onRunClick={
        () => {
          this.props.tests.forEach((test, index) => {
            dispatch(runTest(index));

            test.run(passed => {
              dispatch(completeTest(index, passed));
            });
          });
        }
      }/>

      <TestList tests={this.props.tests} onTestClick={ index => {
        dispatch(runTest(index));

        this.props.tests[index].run(passed => {
          dispatch(completeTest(index, passed));
        });
      }}/>
     </div>
   );
  }
}

let Container = connect(function(state) {
  return Object.assign({}, {
    tests: state
  });
})(App);

const RUN_TEST = 'RUN_TEST';
const COMPLETE_TEST = 'COMPLETE_TEST';

function runTest(index) {
  return { type: RUN_TEST, index };
}

function completeTest(index, passed) {
  return { type: COMPLETE_TEST, index, passed };
}

let store = createStore(function reduce(state, action) {
  switch (action.type) {
    case RUN_TEST:
      state = state.slice(0);
      state[action.index] = Object.assign({}, state[action.index], {
        state: 'running',
      });
      return state;

    case COMPLETE_TEST:
      state = state.slice(0);
      state[action.index] = Object.assign({}, state[action.index], {
        state: action.passed ? 'passed' : 'failed',
      });

      return state;

    default:
      return state;
  }
}, tests.map(test => {
  return Object.assign({}, test, {
    state: 'pending'
  });
}));

render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')
)
