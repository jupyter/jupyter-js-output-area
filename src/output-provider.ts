import {IOutput} from './i-output';
import {IOutputArea} from './i-output-area';

/**
 * Provides Jupyter outputs to an output area.
 *
 * This class manages the conversion of Jupyter messages to output state, and
 * handles adding the output state to the output area.
 */
export class OutputProvider implements IOutputArea {
    private _outputArea: IOutputArea;
    private _clear_queued: boolean = false;
    
    /**
     * Public constructor
     * @param  {IOutputArea} outputArea - output area that the provider will provide for.
     */
    public constructor(outputArea) {
        this._outputArea = outputArea;
    }
    
    /**
     * Get current state
     */
    public get state(): IOutput[] {
        return this._outputArea.state;
    }
    public set state(value: IOutput[]) {
        this._outputArea.state = value;
    }
    
    /**
     * Handle a Jupyter msg protocol message.  Ignores messages that it
     * doesn't know how to handle.
     * @param  {any} msg - Jupyter msg JSON object
     */
    public handle_msg(msg: any): void {
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
                return;
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
                return;
        }
        state.push(<IOutput>output);
        this.state = state;
    }
}
