import {IOutput} from './i-output';

/**
 * Interface for an output area.
 */
export interface IOutputArea {
    
    /**
     * Output area element.
     */
    el: HTMLElement;
    
    /**
     * Output area state object.
     */
    state: IOutput[]; 
    
    /**
     * Callback for when the state changes.
     */
    onchange: (sender: IOutputArea, newState: IOutput[], oldState: IOutput[]) => void;
}
