import {assert} from 'chai';
import {OutputModel} from '../src/output-model';

describe("Output Model Tests", function() {
    before(function(done) {
        this.model = new OutputModel();
        done();
    });
    it("Confirm the state of the default OutputModel", function(done) {
        assert.isFalse(this.model.clearQueued);
        assert.lengthOf(this.model._state, 0);
        done();
    });
});
