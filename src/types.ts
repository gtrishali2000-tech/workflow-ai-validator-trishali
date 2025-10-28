export type Operator = "equals" | "contains_any" | "in" | "regex";
export type ConditionValue = string | number | string[];

export interface Condition {
  field: string;
  operator: Operator;
  value: ConditionValue;
  title?: string;
  id?: string;
  type?: "string" | "number" | "select" | "multiselect";
}

export type TriggerType =
  | "customer_reply"
  | "appointment_booked"
  | "form_submission"
  | "payment_received"
  | "contact_tag_added";

export interface Trigger {
  type: TriggerType;
  name: string;
  conditions?: Condition[];
}

export type ActionType =
  | "send_email"
  | "send_sms"
  | "add_tag_to_contact"
  | "webhook_call"
  | "internal_notification";

export interface SendEmailAttributes {
  subject: string;
  html: string;
  attachments?: string[];
}
export interface SendSmsAttributes { body: string; }
export interface AddTagAttributes { tags: string[]; }
export interface WebhookAttributes {
  method: "GET" | "POST" | "PUT" | "PATCH";
  url: string;
  headers?: { key: string; value: string }[];
  customData?: { key: string; value: string }[];
}
export interface InternalNotificationAttributes {
  title: string;
  body: string;
  userType?: "all" | "owner" | "assignee" | "team";
  redirectPage?: "conversation" | "contact" | "dashboard";
}

export type ActionAttributes =
  | SendEmailAttributes
  | SendSmsAttributes
  | AddTagAttributes
  | WebhookAttributes
  | InternalNotificationAttributes;

export interface Action {
  type: ActionType;
  name: string;
  attributes?: ActionAttributes;
  order?: number;
}

export interface Workflow {
  trigger: Trigger;
  actions: Action[];
}
