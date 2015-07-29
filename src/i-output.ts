/**
 * Interface for output state.
 */
export type IOutput = any;

/*
NBFORMAT SCHEMA
TODO: Decide if we should write types for this even though it's already defined
in nbfromat as a JSON schema.

 "output": {
     "type": "object",
     "oneOf": [
         {"$ref": "#/definitions/execute_result"},
         {"$ref": "#/definitions/display_data"},
         {"$ref": "#/definitions/stream"},
         {"$ref": "#/definitions/error"}
     ]
 },

 "execute_result": {
     "description": "Result of executing a code cell.",
     "type": "object",
     "additionalProperties": false,
     "required": ["output_type", "data", "metadata", "execution_count"],
     "properties": {
         "output_type": {
             "description": "Type of cell output.",
             "enum": ["execute_result"]
         },
         "execution_count": {
             "description": "A result's prompt number.",
             "type": ["integer", "null"],
             "minimum": 0
         },
         "data": {"$ref": "#/definitions/misc/mimebundle"},
         "metadata": {"$ref": "#/definitions/misc/output_metadata"}
     }
 },

 "display_data": {
     "description": "Data displayed as a result of code cell execution.",
     "type": "object",
     "additionalProperties": false,
     "required": ["output_type", "data", "metadata"],
     "properties": {
         "output_type": {
             "description": "Type of cell output.",
             "enum": ["display_data"]
         },
         "data": {"$ref": "#/definitions/misc/mimebundle"},
         "metadata": {"$ref": "#/definitions/misc/output_metadata"}
     }
 },

 "stream": {
     "description": "Stream output from a code cell.",
     "type": "object",
     "additionalProperties": false,
     "required": ["output_type", "name", "text"],
     "properties": {
         "output_type": {
             "description": "Type of cell output.",
             "enum": ["stream"]
         },
         "name": {
             "description": "The name of the stream (stdout, stderr).",
             "type": "string"
         },
         "text": {
             "description": "The stream's text output, represented as an array of strings.",
             "$ref": "#/definitions/misc/multiline_string"
         }
     }
 },

 "error": {
     "description": "Output of an error that occurred during code cell execution.",
     "type": "object",
     "additionalProperties": false,
     "required": ["output_type", "ename", "evalue", "traceback"],
     "properties": {
         "output_type": {
             "description": "Type of cell output.",
             "enum": ["error"]
         },
         "ename": {
             "description": "The name of the error.",
             "type": "string"
         },
         "evalue": {
             "description": "The value, or message, of the error.",
             "type": "string"
         },
         "traceback": {
             "description": "The error's traceback, represented as an array of strings.",
             "type": "array",
             "items": {"type": "string"}
         }
     }
 },

 "unrecognized_output": {
     "description": "Unrecognized output from a future minor-revision to the notebook format.",
     "type": "object",
     "additionalProperties": true,
     "required": ["output_type"],
     "properties": {
         "output_type": {
             "description": "Type of cell output.",
             "not": {
                 "enum": ["execute_result", "display_data", "stream", "error"]
             }
         }
     }
 }
 
 */