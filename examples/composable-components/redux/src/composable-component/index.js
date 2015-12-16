import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DynamicComponent from '../dynamic-component';
import * as actionCreators from '../action-creators';
import styles from './composable-component.css';

class ComposableComponent extends Component {
  render() {
    const { seconds, actions: { addSecond, removeSecond, incrementSecond } } = this.props;
    return (
      <div className={styles.container}>
        <button onClick={() => addSecond()}>Add dynamic component</button>
        <hr />
        {seconds.map((second, index) => (
          <div key={index}>
            <DynamicComponent
              index={index}
              second={second}
              incrementSecond={incrementSecond} />
            <button onClick={() => removeSecond(index)}>Remove dynamic component</button>
            {index + 1 !== seconds.length ? <hr /> : null}
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seconds: state.seconds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposableComponent);
