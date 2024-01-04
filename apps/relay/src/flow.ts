/**
 * Just an observable
 * But I like this name from kotlin more
 */

export class Flow<T> {
    subscriber: ((value: T) => any)[] = []

    constructor(private _value: T) {}

    public get value(): T {
        return this._value
    }

    public set value(it: T) {
        this._value = it
        this.subscriber.forEach(it => {
            it(this._value)
        })
    }

    subscribe(fn: (value: T) => any) {
        this.subscriber.push(fn)
    }

    /**
     * T must be primitive 
     */
    on(value: T, fn: (value: T) => any) {
        this.subscriber.push(newValue => {
            if (newValue === value) {
                fn(newValue)
            }
        })
    }

}