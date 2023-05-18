import { NativeEventEmitter, EmitterSubscription } from 'react-native';

/**
 * @author Wade Baglin
 * @see {@link https://blog.makerx.com.au/a-type-safe-event-emitter-in-node-js/}
 */
class TypedNativeEventEmitter<TEvents extends Record<string, any>> {
  private emitter = new NativeEventEmitter();

  addListener<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ): EmitterSubscription {
    return this.emitter.addListener(eventName, handler as any);
  }

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    this.emitter.emit(eventName, ...(eventArg as []));
  }

  listenerCount<TEventName extends keyof TEvents & string>(
    eventName: TEventName
  ) {
    return this.emitter.listenerCount(eventName);
  }

  removeAllListeners<TEventName extends keyof TEvents & string>(
    eventName: TEventName
  ) {
    this.emitter.removeAllListeners(eventName);
  }

  removeSubscription(subscription: EmitterSubscription) {
    this.emitter.removeSubscription(subscription);
  }
}

export default TypedNativeEventEmitter;
