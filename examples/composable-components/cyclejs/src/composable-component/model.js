import { Observable } from 'rx';

export default function model({ addDynamicComponent$, removeDynamicComponent$ }) {
  return Observable.just([])
    // map `addDynamicComponent$` values to a callback which adds `dynamicComponent` to existing `dynamicComponents`
    .merge(addDynamicComponent$.map(
      dynamicComponent => dynamicComponents => [ ...dynamicComponents, dynamicComponent ]
    ))
    // map `removeDynamicComponent$` values to a callback which removes the `dynamicComponent` matching the index
    .merge(removeDynamicComponent$.map(
      index => dynamicComponents => dynamicComponents.filter((_, i) => index !== i)
    ))
    // call callback (either returned from `addDynamicComponent$` or `removeDynamicComponent$`) and pass `dynamicComponents`
    .scan((dynamicComponents, callback) => callback(dynamicComponents));
}
