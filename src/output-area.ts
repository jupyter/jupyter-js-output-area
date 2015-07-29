/// <reference path="./typings/transformime.d.ts" />

import {IOutput} from './i-output';
import {IOutputArea} from './i-output-area';
import {Transformime} from 'transformime';

/**
 * Displays output area state.
 */
export class OutputArea implements IOutputArea {
    private _doc: Document;
    private _transformime: Transformime;
    private _state: IOutput[];
    
    /**
     * Public constructor
     * @param  {Document} doc=document - optionally provide a handle to the
     *                                 Document instance that the output will be
     *                                 rendered in.
     */
    public constructor(doc: Document = document) {
        this._doc = doc;
        // TODO: Add transformers.
        this._transformime = new Transformime([]);
        this._state = [];
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
        this._state = value;
        for (let output of value) {
            
        }
    }
}
