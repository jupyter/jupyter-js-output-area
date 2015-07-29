import {IOutput} from './i-output';
import {IOutputArea} from './i-output-area';

/**
 * Displays output area state.
 */
export class OutputArea implements IOutputArea {
    private _doc: Document;
    
    /**
     * Public constructor
     * @param  {Document} doc=document - optionally provide a handle to the
     *                                 Document instance that the output will be
     *                                 rendered in.
     */
    public constructor(doc: Document = document) {
        this._doc = doc;
    }
    
    /**
     * Get current state
     */
    public get state(): IOutput[] {
        return [];
    }
    public set state(value: IOutput[]) {
        // TODO: Diff the state with the old state and only update what needs
        // to be updated.
        
    }
}
