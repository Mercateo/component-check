import React, { Component } from 'react';
import styles from './dynamic-component.css';

class DynamicComponent extends Component {
  componentDidMount() {
    const { incrementSecond, index } = this.props;
    this.intervalId = setInterval(() => incrementSecond(index), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { second } = this.props;
    return (
      <div className={styles.container}>
        I count {second} seconds.
      </div>
    )
  }
}

export default DynamicComponent;
