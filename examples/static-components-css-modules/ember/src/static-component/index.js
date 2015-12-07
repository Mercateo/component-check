import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './static-component.css';

Ember.TEMPLATES['components/static-component'] = template;
export default Ember.Component.extend({ styles });
