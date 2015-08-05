// The node.d.ts definition on definitely typed is compatible with target ES6
// so for now we have to declare it ourselves...
declare module 'events' {    
    export interface IEventEmitter {
        addListener(event: string, listener: Function): IEventEmitter;
        on(event: string, listener: Function): IEventEmitter;
        once(event: string, listener: Function): IEventEmitter;
        removeListener(event: string, listener: Function): IEventEmitter;
        removeAllListeners(event?: string): IEventEmitter;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
    }

    export class EventEmitter implements IEventEmitter {
        static listenerCount(emitter: EventEmitter, event: string): number;

        addListener(event: string, listener: Function): EventEmitter;
        on(event: string, listener: Function): EventEmitter;
        once(event: string, listener: Function): EventEmitter;
        removeListener(event: string, listener: Function): EventEmitter;
        removeAllListeners(event?: string): EventEmitter;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
    }
}
