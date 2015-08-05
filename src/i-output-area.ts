import {IOutputStateful} from './i-output-stateful';

/**
 * Interface for an output area.
 */
export interface IOutputArea extends IOutputStateful {
    
    /**
     * Output area element.
     */
    el: HTMLElement;
}
