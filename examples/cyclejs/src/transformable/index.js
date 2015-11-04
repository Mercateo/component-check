/** @jsx hJSX */

import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import Slider from '../composable/slider';

export default function TransformableComponent(sources, props$ = Observable.just({})) {
  const slider = Slider(sources, props$);

  const vtree$ = slider.vtree$.map(vtree => {
      vtree.children.push(<span>←</span>);
      return vtree;
  });

  return vtree$;
}
