export default function intent({ DOM }) {
  return {
    decrement$: DOM.select('.decrement').events('click').map(event => -1),
    increment$: DOM.select('.increment').events('click').map(event => +1)
  };
}
