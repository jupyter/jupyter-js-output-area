// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Type definitions for jupyter-js-output-area
// We reproduce some of the typings for the notebook format.
// Ideally, we'd import these in from some standard source.

declare interface MimeBundle {
  [index: string]: string;

  // we fudge the standard a bit here by not telling Typescript about the application/json
  // key, which will be a Javascript object if it exists.  If we want to tell, then uncomment below:
  //"application/json": {};
}

declare interface ExecuteResult {
  output_type: string; // "execute_result"
  execution_count: number;
  data: MimeBundle;
  metadata: any;
}

declare interface DisplayData {
  output_type: string; // "display_data"
  data: MimeBundle;
  metadata: any;
}

declare interface Stream {
  output_type: string; // "stream"
  name: string;
  text: string;
}

declare interface JupyterError {
  output_type: string; // "error"
  ename: string;
  evalue: string;
  traceback: string[];
}

declare module 'jupyter-js-output-area' {
  export type Output = ExecuteResult | DisplayData | Stream | JupyterError;

  export class OutputModel {
    state: Output[];
    consumeMessage(msg: any): boolean;
  }

  export class OutputView {
    constructor(model: OutputModel, document: HTMLDocument);
    document: HTMLDocument;
    el: HTMLElement;
  }
}
