import {IOutput} from './i-output';

/**
 * Interface for a state change callback.
 */
export interface IStateChangeCallback {
    (newState: IOutput[], oldState: IOutput[]): void;
}  

/**
 * Interface for an output area.
 */
export interface IOutputStateful {

    /**
     * Output area state object.
     */
    state: IOutput[]; 

    /**
     * Callback for when the state changes.
     */
    onchange: IStateChangeCallback[];
}
