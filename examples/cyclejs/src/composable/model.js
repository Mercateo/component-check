import { Observable } from 'rx';

const defaultProps = {
  value: 0,
  decrementValue: -10,
  decrementMin: -20,
  decrementMax: -1,
  incrementValue: 10,
  incrementMin: 1,
  incrementMax: 20
};

export default function model(props$, actions) {
  return props$.map(props => ({ ...defaultProps, ...props }));
}
