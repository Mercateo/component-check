import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './composable-component.css';

var id = 0;

Ember.TEMPLATES['components/composable-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
    this.set('ids', []);
  },
  actions: {
    removeDynamicComponent(index) {
      this.set('ids', this.get('ids').filter((_, i) => index !== i));
    },
    addDynamicComponent() {
      this.set('ids', [ ...this.get('ids'), id++ ]);
    }
  }
});
