// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

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
  IOutputAreaViewModel, OutputViewModel, ExecuteResultViewModel, OutputType,
  ExecuteErrorViewModel, StreamViewModel, DisplayDataViewModel, MimeBundle
} from './OutputAreaViewModel';

import {
  IListChangedArgs, ListChangeType, ObservableList
} from 'phosphor-observablelist';

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


/**
 * A list of transformers used to render outputs
 * 
 * #### Notes
 * The transformers are in ascending priority, so later transforms are more
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

export
class OutputAreaWidget extends Panel {
  constructor(model: IOutputAreaViewModel) {
    super();
    this.addClass('jp-OutputArea');
    this._model = model;
    this.updateCollapsed(model.collapsed);
    this.updateFixedHeight(model.fixedHeight)
    this.updatePrompt(model.prompt);
    model.stateChanged.connect(this.modelStateChanged, this);
    model.outputs.changed.connect(this.outputsChanged, this);
  }

  outputsChanged(sender: ObservableList<OutputViewModel>, 
                 change: IListChangedArgs<OutputViewModel>): void {
    switch (change.type) {
    case ListChangeType.Add:
      this.addItem(change.newIndex, change.newValue as OutputViewModel);
      break;
    case ListChangeType.Move:
      this.moveItem(change.oldIndex, change.newIndex);
      break;
    case ListChangeType.Remove:
      this.removeItem(change.oldIndex);
      break;
    case ListChangeType.Replace:
      this.replaceItems(change.oldIndex, (change.oldValue as OutputViewModel[]).length, change.newValue as OutputViewModel[])
      break;
    case ListChangeType.Set:
      this.setItem(change.newIndex, change.newValue as OutputViewModel);
      break;
    default:
      console.error("Output list change event not recognized")
    }
  }
  
  /**
   * Insert a rendered item at the specified index in the DOM. 
   */
  addItem(index: number, item: OutputViewModel) {
    let node = document.createElement('div');
    let children = this.node.children;
    if (index === children.length) {
      this.node.appendChild(node);
    } else {
      this.node.insertBefore(node, children[index]);
    }
    this.renderItem(item).then((childNode) => {
      node.appendChild(childNode);
    });
  }
  
  /**
   * Move a rendered item in the DOM. 
   */
  moveItem(oldIndex: number, newIndex: number): void {
    let children = this.node.children;
    if (newIndex === children.length) {
      this.node.appendChild(children[oldIndex])
    } else {
      this.node.insertBefore(children[oldIndex], children[newIndex]);
    }
  }
  
  /**
   * Remove a rendered item in the DOM. 
   */
  removeItem(index: number): void {
    this.node.removeChild(this.node.children[index]);
  }

  /**
   * Replace a list of rendered items with new rendered items in the DOM. 
   */
  replaceItems(index: number, count: number, items: OutputViewModel[]) {
    for(let i = 0; i < count; i++) {
      this.removeItem(index);
    }
    for(let i = 0; i < items.length; i++) {
      this.addItem(index + i, items[i])
    }
  }
  
  /**
   * Replace a single rendered item with a new rendered item in the DOM. 
   */
  setItem(index: number, item: OutputViewModel) {
    this.replaceItems(index, 1, [item]);
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
      // to get typing to work easily, we make a new temporary variable
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
   * Change handler for model updates.
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
