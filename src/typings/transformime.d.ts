declare module 'transformime' {
    export interface Transformer {
        mimetype: string;
        transform(data: any): Promise<HTMLElement>;
    }
    
    export class Transformime {
        constructor(transformers: any[]);
        transformRichest(bundle: any, doc?: Document): Promise<{mimetype: string, el: HTMLElement}> ;
        transformRetainMimetype(data: any, mimetype: string, doc?: Document): Promise<{mimetype: string, el: HTMLElement}>;
        transformAll(bundle: any, doc?: Document): Promise<HTMLElement[]>;
        transform(data: any, mimetype: string, doc?: Document): Promise<HTMLElement>;
        getTransformer(mimetype: string): Transformer;
    }
}
