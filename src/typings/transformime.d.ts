declare module 'transformime' {
    export interface Transformer {
        mimetype: string;
        transform(data: any): Promise<HTMLElement>;
    }
    
    export class Transformime {
        constructor(transforms?: any[]);
        transform(bundle: any, document: Document): Promise<{mimetype: string, el: HTMLElement}>;
        del(mimetype: string): void;
        get(mimetype: string): any;
        set(mimetype: string, transform: any): any;
        push(transform: any, mimetype: string): any;
    }
    
    export var TextTransformer: any;
    export var ImageTransformer: any;
    export var HTMLTransformer: any;
}

declare module 'transformime-jupyter-transformers' {
    export var consoleTextTransform: any;
    export var markdownTransform: any;
    export var LaTeXTransform: any;
    export var PDFTransform: any;
}
