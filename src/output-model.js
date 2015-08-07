
import {EventEmitter} from 'events';

/**
 * Provides Jupyter outputs to an output area.
 *
 * This class manages the conversion of Jupyter messages to output state, and
 * handles adding the output state to the output area.
 */
export class OutputModel extends EventEmitter {
    
    
    /**
     * Public constructor
     */
    constructor() {
        super();
        this.clearQueued = false;
        this._state = [];        
    }
    
    /**
     * State
     * @return {Output[]}
     */
    get state() {
        return this._state.slice();
    }
    /**
     * State
     * @param  {Output[]} value new state
     */
    set state(value) {
        this.emit('change', value, this._state);
        this._state = value;
    }
    
    /**
     * Consumes a Jupyter msg protocol message.
     * Ignores messages that it doesn't know how to handle.
     * @param  {any}     msg Jupyter protocol msg JSON
     * @return {boolean}     was the msg consumed
     */
    consume_msg(msg) {
        let state = this.state;
        if (this._cleaQqueued) {
            state = [];
            this._clearQueued = false;
        }
            
        let output = {};
        let msgType = output.output_type = msg.header.msg_type;
        let content = msg.content;
        switch (msgType) {
            case 'clear_output':
                // msg spec v4 had stdout, stderr, display keys
                // v4.1 replaced these with just wait
                // The default behavior is the same (stdout=stderr=display=True, wait=False),
                // so v4 messages will still be properly handled,
                // except for the rarely used clearing less than all output.
                if (msg.content.wait) {
                    this._clearQueued = true;
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
        state.push(output);
        this.state = state;
        return true;
    }
}
