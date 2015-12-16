import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './dynamic-component.css';

Ember.TEMPLATES['components/dynamic-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
    this.set('seconds', 0);
    this.count();
  },
  count() {
    Ember.run.later(this, () => {
      if (!this.isDestroyed) {
        this.set('seconds', this.get('seconds') + 1);
        this.count();
      }
    }, 1000);
  }
});
