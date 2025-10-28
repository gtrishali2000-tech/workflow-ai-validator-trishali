// src/validation.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";

const schemaPath = path.resolve("schema/workflow.schema.json");
if (!fs.existsSync(schemaPath)) {
  throw new Error(`Schema not found at ${schemaPath}`);
}
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateFn = ajv.compile(schema);

/**
 * validateWorkflow - validates a workflow object against schema.
 *
 * Returns:
 *   { valid: boolean, errors: Array<{ instancePath, message, params }> }
 */
export function validateWorkflow(workflow: any) {
  const valid = validateFn(workflow);
  if (valid) return { valid: true, errors: [] };

  const errors =
    (validateFn.errors || []).map((err) => ({
      instancePath: err.instancePath || "(root)",
      message: err.message || "",
      params: err.params || {},
      keyword: err.keyword || "",
      schemaPath: err.schemaPath || ""
    })) || [];

  return {
    valid: false,
    errors
  };
}

/**
 * helper: pretty print validation errors
 */
export function formatValidationErrors(errors: ReturnType<typeof validateWorkflow>["errors"]) {
  return errors.map((e) => `${e.instancePath} ${e.message}`).join("; ");
}


// import Ajv from "ajv";
// import addFormats from "ajv-formats";
// import * as fs from "fs";
// import path from "path";
//
// const schemaPath = path.resolve("schema/workflow.schema.json");
// const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
//
// const ajv = new Ajv({ allErrors: true, strict: false });
// addFormats(ajv);
//
// const validate = ajv.compile(schema);
//
// export function validateWorkflow(workflow: any) {
//     console.log("DEBUG: Workflow:", JSON.stringify(workflow, null, 2));
//   const valid = validate(workflow);
//
//   if (valid) return { valid: true, errors: [] };
//
//   return {
//     valid: false,
//     errors: validate.errors?.map(err => ({
//       instancePath: err.instancePath || "(root)",
//       message: err.message,
//       params: err.params
//     })) || []
//   };
// }




// import Ajv from "ajv";
// import addFormats from "ajv-formats";
//
// export function validateWorkflow(workflow: object): boolean {
//   // Basic validation logic (extend as needed)
//   if (!workflow || typeof workflow !== 'object') return false;
//
//   const { trigger, actions } = workflow as any;
//
//   if (
//     !trigger ||
//     typeof trigger.type !== 'string' ||
//     typeof trigger.name !== 'string' ||
//     !Array.isArray(trigger.conditions)
//   ) {
//     return false;
//   }
//
//   if (
//     !actions ||
//     !Array.isArray(actions) ||
//     actions.some(
//       (action: any) =>
//         typeof action.type !== 'string' ||
//         typeof action.name !== 'string' ||
//         typeof action.attributes !== 'object'
//     )
//   ) {
//     return false;
//   }
//
//   return true;
// }

