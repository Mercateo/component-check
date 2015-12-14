import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DynamicComponent from '../dynamic-component';
import { incrementSecond } from '../action-creators';

class ExampleApp extends Component {
  render() {
    const { seconds, actions: { incrementSecond } } = this.props;
    return (
      <div>
        {seconds.map((second, index) => (
          <DynamicComponent
            key={index}
            index={index}
            second={second}
            incrementSecond={incrementSecond} />
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
    actions: bindActionCreators({ incrementSecond }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleApp);
