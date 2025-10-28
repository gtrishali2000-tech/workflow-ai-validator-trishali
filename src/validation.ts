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