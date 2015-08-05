/// <reference path="./typings/transformime.d.ts" />

import {IOutput} from './i-output';
import {IStateChangeCallback} from './i-output-stateful';
import {IOutputArea} from './i-output-area';
import {Transformime} from 'transformime';

/**
 * Displays output area state.
 */
export class OutputArea implements IOutputArea {
    public onchange: IStateChangeCallback[];
    private _document: Document;
    private _el: HTMLElement;
    private _transformime: Transformime;
    private _state: IOutput[];
    
    /**
     * Public constructor
     * @param  {Document} document - provide a handle to the
     *                               Document instance that the output will be
     *                               rendered in.
     */
    public constructor(document: Document) {
        this.onchange = [];
        this._document = document;
        this._el = this._document.createElement('div');
        
        this._transformime = new Transformime();
        this._state = [];
    }
    
    /**
     * Output container
     */
    public get el(): HTMLElement {
        return this._el;
    }
    
    /**
     * Get current state
     */
    public get state(): IOutput[] {
        return this._state.slice();
    }
    public set state(value: IOutput[]) {
        // TODO: Diff the state with the old state and only update what needs
        // to be updated.
        for (let output of value) {
            
        }
    
        if (this.onchange && this.onchange.length > 0) {
            this.onchange.map(cb => cb.call(this, value, this._state));
        }
        this._state = value;
    }
}
