import { Mutex } from "async-mutex";

/**
 * Wrap method call with Mutex.runExclusive 
 */
export function withMutex<T extends Object>(obj: T, mutex: Mutex): T {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            // Check if this is a call from proxy then refirect 'this' to original one
            // @ts-ignore
            const value = target[prop]
            if (typeof value === 'function') {
                return function (...args: unknown[]) {
                    // @ts-ignore
                    return mutex.runExclusive(() => value.apply(this === receiver ? target : this, args))
                };
            }

            return Reflect.get(target, prop, receiver);
        },
    })
}