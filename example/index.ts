'use-strict';

import {
  Widget
} from 'phosphor-widget';

import {
  OutputAreaViewModel, OutputAreaWidget, IOutputAreaViewModel,
  OutputType, StreamName
} from '../lib/index';


function main(): void {
  let model = new OutputAreaViewModel();

  // import the data json file
  System.import('example/data/data.json').then((data: any[]) => {
    data.forEach((msg) => {
      consumeMessage(msg, model);
    })
  })
  let out = new OutputAreaWidget(model);
  out.attach(document.body);
}

main();

/**
  * A function to update an output area viewmodel to reflect a stream of messages 
  */
export
function consumeMessage(msg: any, outputArea: IOutputAreaViewModel): void {
    let output: any = {};
    let content = msg.content;
    switch (msg.header.msg_type) {
    case 'clear_output':
      outputArea.clear(content.wait)
      break;
    case 'stream':
      output.outputType = OutputType.Stream;
      output.text = content.text;
      switch(content.name) {
      case "stderr":
        output.name = StreamName.StdErr;
        break;
      case "stdout":
        output.name = StreamName.StdOut;
        break;
      default:
        throw new Error(`Unrecognized stream type ${content.name}`);
      }
      outputArea.add(output);
      break;
    case 'display_data':
      output.outputType = OutputType.DisplayData;
      output.data = content.data;
      output.metadata = content.metadata;
      outputArea.add(output);
      break;
    case 'execute_result':
      output.outputType = OutputType.ExecuteResult;
      output.data = content.data;
      output.metadata = content.metadata;
      output.execution_count = content.execution_count;
      outputArea.add(output);
      break;
    case 'error':
      output.outputType = OutputType.Error;
      output.ename = content.ename;
      output.evalue = content.evalue;
      output.traceback = content.traceback.join('\n');
      outputArea.add(output);
      break;
    default:
      console.error('Unhandled message', msg);
    }
}
