import { Observable } from 'rx';

export default function model({ addDynamicComponent$, removeDynamicComponent$ }) {
  return Observable.just([])
    // map `addDynamicComponent$` values to a callback which adds `vtree$` to existing `vtree$s`
    .merge(addDynamicComponent$.map(
      vtree$ => vtree$s => [ ...vtree$s, vtree$ ]
    ))
    // map `removeDynamicComponent$` values to a callback which removes the `vtree` matching the index
    .merge(removeDynamicComponent$.map(
      index => vtree$s => vtree$s.filter((_, i) => index !== i)
    ))
    // call callback (either returned from `addDynamicComponent$` or `removeDynamicComponent$`) and pass `vtree$s`
    .scan((vtree$s, callback) => callback(vtree$s));
}
