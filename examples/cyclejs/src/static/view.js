/** @jsx hJSX */

import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';

export default function view() {
  return Observable.just(
    <p>Static paragraph.</p>
  );
}
