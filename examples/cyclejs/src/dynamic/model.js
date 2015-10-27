import { Observable } from 'rx';

export default function model() {
  // use random value between 1 and 10 as start value
  const initial$ = Observable.just(Math.ceil(Math.random() * 10));

  // update every 2 seconds
  return initial$.merge(Observable.interval(2000)).scan(counter => ++counter);
}
