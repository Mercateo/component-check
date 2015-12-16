import DynamicComponent from '../dynamic-component';

export default function intent(sources, id) {
  return {
    addDynamicComponent$: sources.DOM.select(`.${id}.addDynamicComponent`)
      .events('click')
      .map(() => DynamicComponent(sources)),
    removeDynamicComponent$: sources.DOM.select(`.${id}.removeDynamicComponent`)
      .events('click')
      .map(event => parseInt(event.target.value))
  };
}
