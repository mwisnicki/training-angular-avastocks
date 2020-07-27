import {
  Observable,
  ConnectableObservable,
  Subscription,
  MonoTypeOperatorFunction,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Automatically connect to observable.
 *
 * Useful when applied after publishReplay to capture values before first subscription.
 *
 * @param onSubscribed optionally consume Subscription created by connection.
 */
export function connected<T>(
  onSubscribed?: (s: Subscription) => void
): MonoTypeOperatorFunction<T> {
  return function connectedOperatorFunction(obs: Observable<T>) {
    if (obs instanceof ConnectableObservable || 'connect' in obs) {
      const subscribtion = obs.connect();
      if (onSubscribed) onSubscribed(subscribtion);
    } else {
      // this works with shareReply but I don't know why
      obs.subscribe(() => {}).unsubscribe();
    }
    return obs;
  };
}

export function bindTo<O extends HasDisposer, K extends keyof O, T extends O[K]>(
  target: O,
  property: K
): MonoTypeOperatorFunction<T>;

export function bindTo<O, K extends keyof O, T extends O[K]>(
  target: O,
  property: K,
  disposer: Observable<void>
): MonoTypeOperatorFunction<T>;

/**
 * Subscribes to observer and binds its value to target property.
 *
 * Automatically unsubscribes when traget is disposed.
 */
export function bindTo<O, K extends keyof O, T extends O[K]>(
  target: O,
  property: K,
  disposer?: Observable<void>
): MonoTypeOperatorFunction<T> {
  if (!disposer && 'dispose$' in target) {
    disposer = target['dispose$'];
  }
  return function bindToOperator(obs: Observable<T>) {
    const sub = obs.subscribe({
      next(v) {
        target[property] = v;
      },
      complete() {
        sub.unsubscribe();
      },
    });
    if (disposer) disposer.subscribe(() => sub.unsubscribe());
    return obs;
  };
}

export interface HasDisposer {
  dispose$: Observable<void>;
}

export class DisposerSubject extends Subject<void> {
  constructor(private context?) {
    super();
  }

  dispose() {
    if (!this.closed) {
      this.next();
      this.complete();
    }
  }

  /** Return operator that will transfer ownership of subscription to this disposer */
  own<UserData>(): MonoTypeOperatorFunction<UserData> {
    return takeUntil(this);
  }
}
