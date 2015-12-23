import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './interactive-component.css';

Ember.TEMPLATES['components/interactive-component'] = template;
export default Ember.Component.extend({
  styles,
  value: 0,
  actions: {
    decrement() {
      this.decrementProperty('value');
    },
    increment() {
      this.incrementProperty('value');
    }
  }
});
