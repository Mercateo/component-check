import React, { Component } from 'react';
import styles from './interactive-component.css';

class InteractiveComponent extends Component {
  render() {
    const { index, value, decrement, increment } = this.props;
    return (
      <div className={styles.container}>
        <button onClick={() => decrement(index)}>Decrement</button>
        &nbsp;
        Current value: {value}
        &nbsp;
        <button onClick={() => increment(index)}>Increment</button>
      </div>
    )
  }
}

export default InteractiveComponent;
