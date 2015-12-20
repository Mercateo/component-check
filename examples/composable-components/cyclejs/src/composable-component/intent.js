import DynamicComponent from '../dynamic-component';

export default function intent(sources) {
  return {
    addDynamicComponent$: sources.DOM.select('.addDynamicComponent')
      .events('click')
      .map(() => DynamicComponent(sources).DOM),
    removeDynamicComponent$: sources.DOM.select('.removeDynamicComponent')
      .events('click')
      .map(event => parseInt(event.target.value))
  };
}
