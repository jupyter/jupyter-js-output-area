// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  IChangedArgs, Property
} from 'phosphor-properties';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
  ObservableList
} from 'phosphor-observablelist';


/**
* A Mime bundle of data.
*/
export interface MimeBundle {
  [key: string]: string;
  'application/json'?: any;
}


export
enum OutputType {
  /**
   * The "execute_result" message type from the message spec.
   */
  ExecuteResult,

  /**
   * The "display_data" message type from the message spec.
   */
  DisplayData,

  /**
   * The "stream" message type from the message spec.
   */
  Stream,

  /**
   * The "error" message type from the message spec.
   */
  Error
}


/**
* The base interface for an output view model.
*/
export
class OutputBaseViewModel {

  /**
  * A signal emitted when state of the output changes.
  */
  stateChanged: ISignal<OutputBaseViewModel, IChangedArgs<any>>;

  /**
  * The output type.
  */
  outputType: OutputType;
}


/**
* An output view model for display data.
*/
export
class DisplayDataViewModel extends OutputBaseViewModel {
  /**
  * The raw data for the output.
  */
  data: MimeBundle;

  /**
  * Metadata about the output.
  */
  metadata: any;
  
  /**
   * Output type
   */
  outputType: OutputType = OutputType.DisplayData;
}


/**
* An output view model for an execute result.
*/
export
class ExecuteResultViewModel extends DisplayDataViewModel {
  /**
  * The current execution count.
  */
  executionCount: number; // this is also a property on the cell?

  /**
   * Output type
   */
  outputType: OutputType = OutputType.ExecuteResult;
}


export
enum StreamName {
  /**
   * The "stdout" stream name from the message spec.
   */
  StdOut,

  /**
   * The "stderr" stream name from the message spec.
   */
  StdErr
}


/**
* An output view model for stream data.
*/
export 
class StreamViewModel extends OutputBaseViewModel {
  /**
  * The type of stream.
  */
  name: StreamName;

  /**
  * The text from the stream.
  */
  text: string;

  /**
   * Output type
   */
  outputType: OutputType = OutputType.Stream;
}


function isStreamViewModel(model: OutputBaseViewModel): model is StreamViewModel {
  return model.outputType === OutputType.Stream;
}


/**
* An output view model for an execute error.
*/
export
class ExecuteErrorViewModel extends OutputBaseViewModel {
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
  * 
  * #### Notes
  * This is an array of strings that has been concatenated to a single string.
  */
  traceback: string;
  
  /**
   * Output type
   */
  outputType: OutputType = OutputType.Error;
}


/**
* An output model that is one of the valid output types.
*/
export 
type OutputViewModel = (
  ExecuteResultViewModel | DisplayDataViewModel | StreamViewModel | 
  ExecuteErrorViewModel
);


/**
* The view model for an output area.
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
  * Whether the output has a fixed maximum height.
  */
  fixedHeight: boolean;

  /**
  * The output prompt.
  */
  prompt: string;

  /**
  * The actual outputs.
  */
  outputs: ObservableList<OutputViewModel>;

  /**
  * A convenience method to add an output to the end of the outputs list, 
  * combining outputs if necessary.
  */
  add(output: OutputViewModel): void;

  /**
  * Clear all of the output.
  */
  clear(wait: boolean): void;
}


/**
 * An implementation of an input area view model.
 */
export
class OutputAreaViewModel implements IOutputAreaViewModel {

  /**
   * A signal emitted when the state of the model changes.
   *
   * #### Notes
   * This will not trigger on changes to the output list. For output change handlers, 
   * listen to [[outputs]] events directly.  
   * 
   * **See also:** [[stateChanged]]
   */
  static stateChangedSignal = new Signal<OutputAreaViewModel, IChangedArgs<any>>();

  /**
  * A property descriptor which determines whether the output has a maximum fixed height.
  *
  * **See also:** [[fixedHeight]]
  */
  static fixedHeightProperty = new Property<OutputAreaViewModel, boolean>({
    name: 'fixedHeight',
    notify: OutputAreaViewModel.stateChangedSignal,
  });

  /**
  * A property descriptor which determines whether the input area is collapsed or displayed.
  *
  * **See also:** [[collapsed]]
  */
  static collapsedProperty = new Property<OutputAreaViewModel, boolean>({
    name: 'collapsed',
    notify: OutputAreaViewModel.stateChangedSignal,
  });

  /**
  * A property descriptor containing the prompt.
  *
  * **See also:** [[prompt]]
  */
  static promptProperty = new Property<OutputAreaViewModel, string>({
    name: 'prompt',
    notify: OutputAreaViewModel.stateChangedSignal,
  });

  /**
   * A signal emitted when the state of the model changes.
   *
   * #### Notes
   * This will not trigger on changes to the output list. For output change handlers, 
   * listen to [[outputs]] events directly.
   * 
   * This is a pure delegate to the [[stateChangedSignal]].
   */
  get stateChanged() {
    return OutputAreaViewModel.stateChangedSignal.bind(this);
  }

  /**
   * Get whether the output has a maximum fixed height.
   *
   * #### Notes
   * This is a pure delegate to the [[fixedHeightProperty]].
   */
  get fixedHeight() {
    return OutputAreaViewModel.fixedHeightProperty.get(this);
  }

  /**
   * Set whether the output has a maximum fixed height.
   *
   * #### Notes
   * This is a pure delegate to the [[fixedHeightProperty]].
   */
  set fixedHeight(value: boolean) {
    OutputAreaViewModel.fixedHeightProperty.set(this, value);
  }

  /**
   * Get whether the input area should be collapsed or displayed.
   *
   * #### Notes
   * This is a pure delegate to the [[collapsedProperty]].
   */
  get collapsed() {
    return OutputAreaViewModel.collapsedProperty.get(this);
  }

  /**
   * Set whether the input area should be collapsed or displayed.
   *
   * #### Notes
   * This is a pure delegate to the [[collapsedProperty]].
   */
  set collapsed(value: boolean) {
    OutputAreaViewModel.collapsedProperty.set(this, value);
  }

  /**
   * Get the prompt.
   *
   * #### Notes
   * This is a pure delegate to the [[promptProperty]].
   */
  get prompt() {
    return OutputAreaViewModel.promptProperty.get(this);
  }

  /**
   * Set the prompt.
   *
   * #### Notes
   * This is a pure delegate to the [[promptProperty]].
   */
  set prompt(value: string) {
    OutputAreaViewModel.promptProperty.set(this, value);
  }
  
  /**
   * Add an output, which may be combined with previous output 
   * (e.g. for streams).
   */
  add(output: OutputViewModel) {
    // if we received a delayed clear message, then clear now
    if (this._clearNext) {
      this.clear();
      this._clearNext = false;
    }
    
    // Consolidate outputs if they are stream outputs of the same kind
    let lastOutput = this.outputs.get(-1);
    if (isStreamViewModel(output)
        && lastOutput && isStreamViewModel(lastOutput)
        && output.name === lastOutput.name) {
      // In order to get a list change event, we add the previous 
      // text to the current item and replace the previous item. 
      // This also replaces the metadata of the last item.
      output.text = lastOutput.text + output.text;
      this.outputs.set(-1, output);
    } else {
      this.outputs.add(output);
    }
  }

  /**
  * Clear all of the output.
  * 
  * @param wait Delay clearing the output until the next message is added.
  */
  clear(wait: boolean = false) {
    if(wait) {
      this._clearNext = true;
    } else {
      this.outputs.clear();
    }
  }

  outputs = new ObservableList<OutputViewModel>();
  
  /**
   * Whether to clear on the next message add.
   */
  private _clearNext = false;
}


