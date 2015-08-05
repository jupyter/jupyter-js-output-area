/// <reference path="./typings/transformime.d.ts" />

import {IOutput} from './i-output';
import {IOutputView} from './i-output-view';
import {IOutputModel} from './i-output-model';
import {
    Transformime,
    TextTransformer,
    ImageTransformer,
    HTMLTransformer
} from "transformime";

import {
    consoleTextTransform,
    markdownTransform,
    LaTeXTransform,
    PDFTransform
} from "transformime-jupyter-transformers";

/**
 * Displays output area state.
 */
export class OutputView implements IOutputView {
    private _model: IOutputModel;
    private _document: Document;
    private _el: HTMLElement;
    private _transformime: Transformime;
    
    /**
     * Public constructor
     * @param  {IOutputModel} model    output model that this view represents
     * @param  {Document}     document handle to the Document instance that 
     *                                 the output will be rendered in.
     */
    public constructor(model: IOutputModel, document: Document) {
        this._model = model;
        this._document = document;
        this._el = this._document.createElement('div');
        
        // Transformers are in reverse priority order
        // so that new ones can be `push`ed on with higher priority
        let transformers = [
            TextTransformer,
            PDFTransform,
            ImageTransformer,
            // SVG would go here, IF I HAD ONE
            consoleTextTransform,
            LaTeXTransform,
            markdownTransform,
            HTMLTransformer
            // JavaScript would go here, IF I HAD ONE
        ];
        this._transformime = new Transformime(transformers);
        
        this._bindEvents();
    }
    
    /**
     * Output container element
     * @return {HTMLElement}
     */
    public get el(): HTMLElement {
        return this._el;
    }
    
    /**
     * Listen to relevant model events.
     */
    private _bindEvents(): void {
        this._model.on('change', this._modelChange.bind(this));
    }
    
    /**
     * Handle when the model changes.
     * @param {IOutput[]} newState new state of the model
     * @param {IOutput[]} oldState old, previous, state of the model
     */
    private _modelChange(newState: IOutput[], oldState: IOutput[]): void {
        // TODO: Diff states.
        // Fast, but ugly way to clear all of the elements.
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        
        // Use transformime to render state.
        var orderPromise = Promise.resolve();
        for (let output of newState) {
            let bundle: any = {};
            switch(output.output_type) {
                case 'execute_result':
                case 'display_data':
                    bundle = output.data;
                    break;
                case 'stream':
                    bundle = {'jupyter/console-text': output.data.text};
                    break;
                case 'error':
                    // The parts that used to be the TracebackTransform
                    let text, traceback;
                    traceback = output.traceback;
                    if (traceback !== undefined && traceback.length > 0) {
                        text = '';
                        var len = traceback.length;
                        for (var i=0; i<len; i++) {
                            text = text + traceback[i] + '\n';
                        }
                        text = text + '\n';
                    }
                    bundle = {'jupyter/console-text': text};
                    break;
                default:
                    console.warn('Unrecognized output type: ' + output.output_type);
                    bundle = {'text/plain': 'Unrecognized output type' + JSON.stringify(output)};
            }

            let elementPromise = this._transformime.transform(bundle, this._document);
            orderPromise = orderPromise.then(() => {
                return elementPromise.then((results: {el: HTMLElement, mimetype: string}) => {
                    this.el.appendChild(results.el);
                });
            });
        }
    }
}
