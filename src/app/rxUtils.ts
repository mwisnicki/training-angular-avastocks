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

export class DisposerSubject extends Subject<void> {
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
