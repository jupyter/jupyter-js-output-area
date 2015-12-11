'use-strict';

import {
  Widget
} from 'phosphor-widget';

import {
  OutputAreaViewModel, OutputAreaWidget, consumeMessage
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
  Widget.attach(out, document.body);
}

main();
