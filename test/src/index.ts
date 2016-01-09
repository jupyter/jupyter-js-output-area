// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import expect = require('expect.js');

import {
  OutputAreaModel, OutputAreaWidget
} from '../../lib';


describe('jupyter-js-output-area', () => {

  describe('OutputAreaWidget', () => {

    it('should always pass', () => {
        let model = new OutputAreaModel();
        let widget = new OutputAreaWidget(model);
    });

  });

});
