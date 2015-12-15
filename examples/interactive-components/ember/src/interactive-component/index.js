import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './interactive-component.css';

Ember.TEMPLATES['components/interactive-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
    this.set('value', 0);
  },
  actions: {
    decrement() {
      this.set('value', this.get('value') - 1);
    },
    increment() {
      this.set('value', this.get('value') + 1);
    }
  }
});
