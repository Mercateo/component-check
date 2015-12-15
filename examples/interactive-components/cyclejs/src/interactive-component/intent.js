export default function intent({ DOM }, id) {
  return {
    decrement$: DOM.select(`.${id}.decrement`).events('click').map(event => -1),
    increment$: DOM.select(`.${id}.increment`).events('click').map(event => +1)
  };
}
