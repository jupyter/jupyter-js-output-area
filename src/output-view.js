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
export class OutputView {
    
    /**
     * Public constructor
     * @param  {IOutputModel} model    output model that this view represents
     * @param  {Document}     document handle to the Document instance that 
     *                                 the output will be rendered in.
     */
    constructor(model, document) {
        this.model = model;
        
        let el = document.createElement('div');
        Object.defineProperty(this, 'document', {get: () => document});
        Object.defineProperty(this, 'el', {get: () => el});
        
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
        this.transformime = new Transformime(transformers);
        
        this._bindEvents();
    }
    
    /**
     * Listen to relevant model events.
     */
    _bindEvents() {
        this.model.on('change', this._modelChange.bind(this));
    }
    
    /**
     * Handle when the model changes.
     * @param {Output[]} newState new state of the model
     * @param {Output[]} oldState old, previous, state of the model
     */
    _modelChange(newState, oldState) {
        // TODO: Diff states.
        // Fast, but ugly way to clear all of the elements.
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        
        // Use transformime to render state.
        let orderPromise = Promise.resolve();
        for (let output of newState) {
            let bundle = {};
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
                        let len = traceback.length;
                        for (let i=0; i<len; i++) {
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

            let elementPromise = this.transformime.transform(bundle, this.document);
            orderPromise = orderPromise.then(() => {
                return elementPromise.then((results) => {
                    this.el.appendChild(results.el);
                });
            });
        }
    }
}
