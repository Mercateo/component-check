export default function intent({ DOM }, id) {
  return {
    change$: DOM.select(`.${id}.slider`).events('input').map(event => Number(event.target.value))
  };
}
