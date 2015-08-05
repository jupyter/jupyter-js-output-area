import {IOutput} from './i-output';
import {IOutputStateful, IStateChangeCallback} from './i-output-stateful';

/**
 * Glues together two output statefuls.
 */
export class Glue {
    private _handle1: IStateChangeCallback;
    private _handle2: IStateChangeCallback;
    private _stateful1: IOutputStateful;
    private _stateful2: IOutputStateful;
    
    /**
     * Public constructor
     */
    public constructor(stateful1: IOutputStateful, stateful2: IOutputStateful) {
        this._stateful1 = stateful1;
        this._stateful2 = stateful2;
        this._handle1 = (newState: IOutput[], oldState: IOutput[]): void => {
            stateful2.state = newState;
        }
        this._handle2 = (newState: IOutput[], oldState: IOutput[]): void => {
            stateful1.state = newState;
        }
        this._stateful1.onchange.push(this._handle1);
        this._stateful2.onchange.push(this._handle2);
    }
    
    /**
     * Unglue the two output statefuls
     */
    public unglue(): void {
        this._stateful1.onchange.splice(this._stateful1.onchange.indexOf(this._handle1), 1);
        this._stateful2.onchange.splice(this._stateful2.onchange.indexOf(this._handle2), 1);
    }
}
