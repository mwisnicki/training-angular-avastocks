import {
  Observable,
  ConnectableObservable,
  Subscription,
  MonoTypeOperatorFunction,
} from 'rxjs';

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
    if ('connect' in obs || obs instanceof ConnectableObservable) {
      const subscribtion = obs.connect();
      if (onSubscribed) onSubscribed(subscribtion);
      console.warn('connected');
    } else {
      obs.subscribe(() => {}).unsubscribe();
    }
    return obs;
  };
}
