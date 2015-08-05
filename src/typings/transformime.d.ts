/// <reference path="./es6-promise.d.ts" />

declare module 'transformime' {
    export interface Transformer {
        mimetype: string;
        transform(data: any): Promise<HTMLElement>;
    }
    
    export class Transformime {
        constructor(transforms?: any[]);
        transform(bundle: any, document: Document): Promise<HTMLElement>;
        del(mimetype: string): void;
        get(mimetype: string): any;
        set(mimetype: string, transform: any): any;
        push(transform: any, mimetype: string): any;
    }
}
