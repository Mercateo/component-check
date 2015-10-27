import { Observable } from 'rx';

const defaultProps = {
  value: 10,
  min: 1,
  max: 20
};

export default function model(props$, actions) {
  return props$.map(props => ({ ...defaultProps, ...props }))
    .merge(actions.change$)
    .scan((props, value) => {
      return { ...props, value };
    });
}
