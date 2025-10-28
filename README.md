# Workflows AI - Live Coding Round

**Duration:** 60 minutes  
**Reading Time:** 5 minutes

## Overview

Build an AI-powered workflow generator that converts natural language descriptions into structured JSON workflows. Example: "When a customer reply contains 'urgent', notify the team" → valid workflow JSON.

This exercise mirrors real AI engineering work at HighLevel and covers:
- LLM integration
- Retrieval-augmented generation (RAG)
- JSON schema validation
- Error handling and repair
- Evaluation and metrics

## Goal

Primary objective: Improve accuracy of workflow generation from natural language.

Key challenge: The baseline has naive validation/repair. Make it more robust and accurate.

## What You’re Given

A working TypeScript codebase with:

```
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── .env.example                # OpenAI setup
├── schema/workflow.schema.json # JSON schema for validation
├── data/
│   ├── recipes.json           
└── src/
    ├── types.ts                # TypeScript definitions
    ├── llm.ts                  # OpenAI adapter (swappable)
    ├── retriever.ts            # TF-IDF retrieval for examples
    ├── validation.ts           # AJV schema validation
    ├── prompt.ts               # Prompt composition
    ├── generateWorkflow.ts     # Main generation logic
    └── run.ts                  # CLI interface
```

## Quick Start (2 minutes)

```bash
# 1) Setup
cp .env.example .env  # Add your OpenAI API key
npm install

# 2) Test the system
npm run dev -- --prompt "Notify team when customer reply contains phrase urgent"

# 3) Run evaluation
npm run eval
```

Expected baseline: ~60-70% accuracy on evaluation metrics.


### Core Components

1. Retriever (`retriever.ts`)
2. Prompt Builder (`prompt.ts`)
3. LLM Adapter (`llm.ts`)
4. Validator (`validation.ts`)
5. Generator (`generateWorkflow.ts`)

## Workflow Schema (Key Concepts)

Triggers: What starts the workflow
- `customer_reply`, `appointment_booked`, `form_submission`, `payment_received`, `contact_tag_added`

Actions: What happens when triggered  
- `send_email`, `send_sms`, `add_tag_to_contact`, `webhook_call`, `internal_notification`

Conditions: Filter criteria (field + operator + value)
- Operators: `equals`, `contains_any`, `in`, `regex`

Example workflow:
```json
{
  "trigger": {
    "type": "customer_reply",
    "name": "Urgent Reply Detection",
    "conditions": [
      { "field": "message.body", "operator": "contains_any", "value": ["urgent"] }
    ]
  },
  "actions": [
    {
      "type": "internal_notification",
      "name": "Alert Team",
      "attributes": {
        "title": "Urgent Customer Reply",
        "body": "Please respond immediately"
      }
    }
  ]
}
```

## Evaluation Metrics

Measured metrics:
- Schema validity (matches JSON schema)
- Trigger type accuracy
- Action types overlap
- Field matching accuracy (conditions)