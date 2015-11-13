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
    it("consumeMessage errors on unkown message type", function(done) {
        var badMsg = {
            "header" : {
                "msg_id" : "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username" : "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "unknown_fruit",
                "version": "5.0"
            },
            "parent_header" : {},
            "metadata": {},
            "content": {}
        };
        assert.isFalse(this.model.consumeMessage(badMsg));
        assert.lengthOf(this.model.state, 0);
        done();
    });
    it("consumeMessage properly handles a clear_output message", function(done) {
        var coMsg = {
            "header" : {
                "msg_id" : "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username" : "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "clear_output",
                "version": "5.0"
            },
            "parent_header" : {},
            "metadata": {},
            "content": {}
        };
        assert.isTrue(this.model.consumeMessage(coMsg));

        done();
    });
    it("consumeMessage properly handles a stream message", function(done) {
        var sMsg = {
            "header" : {
                "msg_id" : "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username" : "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "stream",
                "version": "5.0"
            },
            "parent_header" : {},
            "metadata": {},
            "content": {
                "name": "stdout",
                "text": "This is a stream test"
            }
        };
        assert.isTrue(this.model.consumeMessage(sMsg));
        var expected = sMsg.content;
        assert.lengthOf(this.model.state, 1);
        assert.equal(this.model.state[0].output_type, "stream");
        assert.equal(this.model.state[0].name, "stdout");
        assert.equal(this.model.state[0].text, "This is a stream test");
        done();
    });
    it("consumeMessage properly handles a display_data message", function(done) {
        var dMsg = {
            "header" : {
                "msg_id" : "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username" : "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "stream",
                "version": "5.0"
            },
            "parent_header" : {},
            "metadata": {},
            "content": {
                "source" : "stevo",
                
            }
        };
        assert.isTrue(this.model.consumeMessage(dMsg));
        done();
    });
    it("consumeMessage properly handles a execute_result message", function(done) {
        var eMsg = {
            "header": {
                "msg_id": "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username": "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "execute_result",
                "version": "5.0"
            },
            "parent_header": {},
            "metadata": {},
            "content": {
                "data": "test_data",
                "metadata": "test_metadata",
                "execution_count": 0
            }
        };
        assert.isTrue(this.model.consumeMessage(eMsg));
        done();
    });
    it("consumeMessage properly handles a error message", function(done) {
        var errMsg = {
            "header": {
                "msg_id": "6e539a79-6e41-4767-ba4b-33b938fb73e2",
                "username": "tester",
                "session": "c38c32e4-be39-43e5-a8f5-36dfb2551d4c",
                "msg_type": "error",
                "version": "5.0"
            },
            "parent_header": {},
            "metadata": {},
            "content": {
                "name": "big problem",
                "evalue": "You've got a big problem",
                "traceback": "Traceback \n Problems everywhere"
            }
        };
        assert.isTrue(this.model.consumeMessage(errMsg));
        done();
    });
});
