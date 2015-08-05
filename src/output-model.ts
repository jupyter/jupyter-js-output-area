/// <reference path="./typings/events.d.ts" />

import {IOutput} from './i-output';
import {IOutputModel} from './i-output-model';
import {EventEmitter} from 'events';

/**
 * Provides Jupyter outputs to an output area.
 *
 * This class manages the conversion of Jupyter messages to output state, and
 * handles adding the output state to the output area.
 */
export class OutputModel extends EventEmitter implements IOutputModel {
    private _clear_queued: boolean = false;
    private _state: IOutput[];
    
    /**
     * Public constructor
     */
    public constructor() {
        super();
        this._state = [];
    }
    
    /**
     * State
     * @return {IOutput[]}
     */
    public get state(): IOutput[] {
        return this._state.slice();
    }
    /**
     * State
     * @param  {IOutput[]} value new state
     */
    public set state(value: IOutput[]) {
        this.emit('change', value, this._state);
        this._state = value;
    }
    
    /**
     * Consumes a Jupyter msg protocol message.
     * Ignores messages that it doesn't know how to handle.
     * @param  {any}     msg Jupyter protocol msg JSON
     * @return {boolean}     was the msg consumed
     */
    public consume_msg(msg: any): boolean {
        var state: any[] = this.state;
        if (this._clear_queued) {
            state = [];
            this._clear_queued = false;
        }
            
        var output: any = {};
        var msg_type = output.output_type = msg.header.msg_type;
        var content = msg.content;
        switch (msg_type) {
            case 'clear_output':
                // msg spec v4 had stdout, stderr, display keys
                // v4.1 replaced these with just wait
                // The default behavior is the same (stdout=stderr=display=True, wait=False),
                // so v4 messages will still be properly handled,
                // except for the rarely used clearing less than all output.
                if (msg.content.wait) {
                    this._clear_queued = true;
                } else {
                    state = [];
                }
                return true;
            case 'stream':
                output.text = content.text;
                output.name = content.name;
                break;
            case 'display_data':
                output.data = content.data;
                output.metadata = content.metadata;
                break;
            case 'execute_result':
                output.data = content.data;
                output.metadata = content.metadata;
                output.execution_count = content.execution_count;
                break;
            case 'error':
                output.ename = content.ename;
                output.evalue = content.evalue;
                output.traceback = content.traceback;
                break;
            default:
                console.warn('unhandled output message', msg);
                return false;
        }
        state.push(<IOutput>output);
        this.state = state;
        return true;
    }
}
