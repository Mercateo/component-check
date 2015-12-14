import React, { Component } from 'react';
import styles from './dynamic-component.css';

class DynamicComponent extends Component {
  componentDidMount() {
    const { incrementSecond, index } = this.props;
    setInterval(() => incrementSecond(index), 1000);
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
