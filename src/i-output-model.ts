/// <reference path="./typings/events.d.ts" />

import {IOutput} from './i-output';
import {IEventEmitter} from 'events';

/**
 * Interface for an output model.
 */
export interface IOutputModel extends IEventEmitter {

    /**
     * Output area state object.
     */
    state: IOutput[]; 
}
