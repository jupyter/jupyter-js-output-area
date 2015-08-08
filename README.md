# jupyter-js-output-area
Javascript APIs for Jupyter output areas

## Demo
See [./demo/demo.html](demo/demo.html).

## Install
### Stable (npm):
```
npm install jupyter-js-output-area
```

### Dev install
```
git clone https://github.com/jupyter/jupyter-js-output-area.git
cd jupyter-js-output-area
```

To build
```
npm install
npm run build
```

## API
### Consumer
To display a Jupyter output area, you need to instantiate an output model and an
output view, in that order.

```js
import {OutputModel, OutputView} from 'jupyter-js-output-area';
let model = new OutputModel();
let view = new OutputView(model, document);
```

You can then display the output by appending it to your document.
```js
document.querySelector('body').appendChild(view.el);
```

To have the output area display actual outputs, you can either pass it full 
Jupyter msgs
```js
model.consumeMessage(msg);
```

or set the state directly
```js
model.state = state;
```

You can save the state by accessing the same property
```js
state = model.state;
```

### Dev
TODO: Describe how to write custom models and views.
