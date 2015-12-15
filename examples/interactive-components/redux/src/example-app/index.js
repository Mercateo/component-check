import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InteractiveComponent from '../interactive-component';
import { decrement, increment } from '../action-creators';

class ExampleApp extends Component {
  render() {
    const { values, actions: { decrement, increment } } = this.props;
    return (
      <div>
        {values.map((value, index) => (
          <InteractiveComponent
            key={index}
            index={index}
            value={value}
            decrement={decrement}
            increment={increment} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    values: state.values
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ decrement, increment }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleApp);
