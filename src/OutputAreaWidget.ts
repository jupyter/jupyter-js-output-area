// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  IListChangedArgs, ListChangeType, ObservableList, IObservableList
} from 'phosphor-observablelist';

import {
  IChangedArgs
} from 'phosphor-properties';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
  ResizeMessage, Widget, Panel
} from 'phosphor-widget';

import {
    Transformime,
    TextTransformer,
    ImageTransformer,
    HTMLTransformer
} from "transformime";

import {
    consoleTextTransform,
    markdownTransform,
    LaTeXTransform,
    PDFTransform,
    SVGTransform,
    ScriptTransform
} from "transformime-jupyter-transformers";

import {
  IOutputAreaViewModel, OutputViewModel, ExecuteResultViewModel, OutputType,
  ExecuteErrorViewModel, StreamViewModel, DisplayDataViewModel, MimeBundle
} from './OutputAreaViewModel';


/**
 * A list of transformers used to render outputs
 * 
 * #### Notes
 * The transformers are in ascending priority--later transforms are more
 * important than earlier ones.
 */
let transformers = [
    TextTransformer,
    PDFTransform,
    ImageTransformer,
    SVGTransform,
    consoleTextTransform,
    LaTeXTransform,
    markdownTransform,
    HTMLTransformer,
    ScriptTransform
];

/**
 * A global transformime object to render all outputs.
 */
let transform = new Transformime(transformers);


/**
 * An output area widget.
 */
export
class OutputAreaWidget extends Panel {
  
  /**
   * Construct an output area widget.
   */
  constructor(model: IOutputAreaViewModel) {
    super();
    this.addClass('jp-OutputArea');
    this._model = model;
    this.updateCollapsed(model.collapsed);
    this.updateFixedHeight(model.fixedHeight)
    this.updatePrompt(model.prompt);
    model.stateChanged.connect(this.modelStateChanged, this);
    follow<OutputViewModel, Widget>(model.outputs, this.children, (out) => {
      let w = new Widget();
      this.renderItem(out).then((out) => {
        w.node.appendChild(out);
      });
      return w;
    });
  }
  
  /**
   * Render an item using the transformime library.
   */
  renderItem(output: OutputViewModel): Promise<HTMLElement> {
    let bundle: MimeBundle;
    switch(output.outputType) {
    case OutputType.ExecuteResult:
      bundle = (output as ExecuteResultViewModel).data;
      break;
    case OutputType.DisplayData:
      bundle = (output as DisplayDataViewModel).data;
      break;
    case OutputType.Stream:
      bundle = {'jupyter/console-text': (output as StreamViewModel).text};
      break;
    case OutputType.Error:
      let out: ExecuteErrorViewModel = output as ExecuteErrorViewModel;
      bundle = {'jupyter/console-text': out.traceback || `${out.ename}: ${out.evalue}`};
      break;
    default:
      console.error(`Unrecognized output type: ${output.outputType}`);
      bundle = {};
    }
    return (transform.transform(bundle, document)
            .then((result) => {return result.el}));
  }

  /**
   * Change handler for model state changes.
   */
  protected modelStateChanged(sender: IOutputAreaViewModel, 
                              args: IChangedArgs<any>) {
    switch (args.name) {
    case 'collapsed':
      this.updateCollapsed(args.newValue);
      break;
    case 'fixedHeight':
      this.updateFixedHeight(args.newValue);
      break;
    case 'prompt':
      this.updatePrompt(args.newValue);
      break;
    }
  }

  protected updateCollapsed(collapsed: boolean): void {
  }

  protected updateFixedHeight(fixedHeight: boolean): void {
  }

  protected updatePrompt(prompt: string): void {
  }

  private _model: IOutputAreaViewModel;  
}

function follow<T,U>(source: IObservableList<T>, 
                                   sink: IObservableList<U>, 
                                   factory: (arg: T)=> U) {
  // Hook up a listener to the source list
  // make corresponding changes to the sink list
  // invoke the add function when you need a new item for sink
  
  // Initialize sink list
  sink.clear();
  for (let i=0; i<source.length; i++) {
    sink.add(factory(source.get(i)))
  }
  
  source.changed.connect((sender, args) => {
    switch(args.type) {
    case ListChangeType.Add:
      // TODO: type should probably be insert, not add, to be consistent with the functions
      // TODO: Too bad we *always* have to cast newValue and oldValue
      sink.insert(args.newIndex, factory(args.newValue as T))
      break;
    case ListChangeType.Move:
      sink.move(args.oldIndex, args.newIndex);
      break;
    case ListChangeType.Remove:
      sink.removeAt(args.oldIndex);
      break;
    case ListChangeType.Replace:
      sink.replace(args.oldIndex, (args.oldValue as T[]).length, 
                   (args.newValue as T[]).map(factory));
      break;
    case ListChangeType.Set:
      sink.set(args.newIndex, factory(args.newValue as T))
      break;
    }
  });
  
}
