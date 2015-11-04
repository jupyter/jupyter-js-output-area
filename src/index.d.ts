// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


/**
 * The arguments object emitted with the `stateChanged` signal.
 */
export
interface IChangedArgs<T> {
  name: string,
  oldValue: T;
  newValue: T;
}


/**
 * The definition of an output area model.
 */
export 
interface IOutputAreaViewModel {

  /**
   * A signal emitted when state of the output area changes.
   */
  stateChanged: ISignal<IOutputAreaViewModel, IChangedArgs<any>>;

  /**
   * Whether the output is collapsed.
   */
  collapsed: boolean;

  /**
   * Whether the output is scrolled (fixed-height).
   */
  scrolled: boolean;

  /**
   * The output prompt.
   */
  prompt: string;

  /**
   * The actual outputs.
   *
   * #### Notes
   * This is a read-only property returning a shallow copy.
   */
  outputs: IOutputViewModel[];

  /**
   * Add an output, which may be combined (e.g. for streams).
   */
  add(output: IOutputModel): void;

  /**
   * Clear all of the output.
   */
  clear(): void;
}


/**
 * An output model that is one of the valid output types.
 */
export 
type IOutputViewModel = (
  IExecuteResultViewModel | IDisplayDataViewModel | IStreamViewModel | 
  IExecuteErrorViewModel
);


/**
 * A Mime bundle of data.
 */
export interface IMimeBundle {
  [key: string]: string;
  'application/json': any;
}


/**
 * An enum of valid output types.
 */
export
enum OutputType = { ExecuteResult, DisplayData, Stream, ExecuteError };


/**
 * An enum of valid stream types.
 */
export
enum StreamType { StdOut, StdErr };


/**
 * The base interface for an output view model.
 */
interface IOutputBaseViewModel {

  /**
   * A signal emitted when state of the output changes.
   */
  stateChanged: ISignal<IOutputBaseViewModel, IChangedArgs<any>>;

  /**
   * The output type.
   */
  outputType: OutputType;
}


/**
 * An output view model for display data.
 */
export
interface IDisplayDataViewModel extends IOutputBaseViewModel {
  /**
   * The raw data for the output.
   */
  data: IMimeBundle;

  /**
   * Metadata about the output.
   */
  metadata: any;
}


/**
 * An output view model for an execute result.
 */
export
interface IExecuteResultViewModel extends IDisplayDataViewModel {
  /**
   * The current execution count.
   */
  executionCount: number; // this is also a property on the cell?
}


/**
 * An output view model for stream data.
 */
export 
interface IStreamViewModel extends IOutputBaseViewModel {
  /**
   * The type of stream.
   */
  name: StreamType;

  /**
   * The text from the stream.
   */
  text: string;
}


/**
 * An output view model for an execute error.
 */
export
interface IExecuteErrorViewModel extends IOutputBaseViewModel {
  /**
   * The name of the error.
   */
  ename: string;

  /**
   * The value of the error.
   */
  evalue: string;

  /**
   * The traceback for the error.
   */
  traceback: string[];
}


declare module 'jupyter-js-output-area' {
  export IOutputViewModel;

  export
  class OutputModel {
    state: Output[];
    consumeMessage(msg: any): boolean;
  }

  export
  class OutputView {
    constructor(model: OutputModel, document: HTMLDocument);
    document: HTMLDocument;
    el: HTMLElement;
  }
}
