# AI-Powered Integrated BPMN Workflow Editor

A workflow editor built with React, TypeScript, and Vite, featuring natural language AI integration for insurance domain workflows.

## Overview

This project implements a comprehensive BPMN-like workflow editor as a reusable Web Component with AI-powered natural language modification capabilities. The editor supports both manual workflow creation and AI-assisted workflow generation through conversational commands.

## Features Implemented

### ✅ Part 1: Mini BPMN Workflow Editor

- **Basic Nodes**: Start, Task, End nodes with drag-and-drop functionality
- **Custom Insurance Nodes**: Create Account, Create Policy, Create Document, Send Email with configurable properties
- **Interactive Canvas**: 
  - Drag nodes around the canvas
  - Connect nodes with arrows (bezier curves)
  - Remove nodes with automatic connection cleanup
  - Visual feedback for alerts and errors
- **Data Management**: Export/import workflow as JSON
- **Web Component**: Fully embeddable as `<workflow-editor></workflow-editor>`

### ✅ Part 2: Chatbot Integration

- **Chat Interface**: Non-intrusive chat panel with message history persistence
- **LLM Integration**: OpenAI API integration with configurable API key and model
- **Natural Language Processing**: Insurance-focused AI assistant that understands domain-specific commands
- **Real-time Workflow Modification**: 
  - Add nodes based on natural language requests
  - Define task properties and variables
  - Auto-connect nodes in logical sequences
  - Handle insurance claim types (car accident, water damage, fire damage, etc.)

### ✅ Bonus Features

- **Error Handling**: Visual feedback on canvas for successful and failed modifications
- **Notifications**: Toast-style notifications with slide-up animations
- **Type Safety**: Full TypeScript implementation with proper type definitions


## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Zustand** for state management
- **Canvas API** for workflow visualization

### AI Integration
- **OpenAI API** with configurable models
- **Custom prompt engineering** for insurance domain
- **Structured response parsing** with error handling
- **Real-time workflow modification**

### Web Component Implementation
- **Shadow DOM** for encapsulation
- **Attribute change detection** for dynamic configuration
- **React 18 createRoot** for component rendering
- **Dynamic style loading** for CSS isolation

## Project Structure

```
src/
├── components/
│   ├── canvas/           # Canvas editor and drawing logic
│   ├── layout/           # UI components (toolbar, sidebar, etc.)
│   └── assistant/        # AI chat interface
├── hooks/               # Custom React hooks
├── services/             # External API integrations
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── constants/            # Application constants
```
---

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kashyapkrlucky/workflow-editor.git
cd workflow-editor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env file
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build as Web Component
npm run build:wc
```

## Usage as Web Component

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="./workflow-editor.js"></script>
    <link rel="stylesheet" href="./workflow-editor.css">
</head>
<body>
    <workflow-editor api-key="your-openai-api-key" model="gpt-5.4-mini"></workflow-editor>
</body>
</html>
```

#### Web Component Attributes

- `api-key`: Your OpenAI API key (optional, can be set via environment)
- `model`: AI model to use (default: "gpt-5.4-mini")

## AI Features

### Natural Language Commands

The AI assistant supports various natural language commands for insurance workflows:

#### Node Creation
- "Add steps for a claim that was denied because of policy expiration"
- "What are the tasks needed to process a standard car accident claim?"
- "Create a workflow for water damage claim processing"

#### Workflow Modification
- "Insert a Task to 'Verify Policy Coverage' right after Start event"
- "Add a Send Email task after the approval step"
- "Connect the Create Policy node to the Document Review task"

#### Insurance Domain Understanding
The AI understands insurance-specific concepts:
- **Claim Types**: car accident, water damage, fire damage, theft, medical, liability
- **Standard Tasks**: verify policy, assess damage, determine coverage, calculate payout, send notification
- **Policy Issues**: expiration, insufficient coverage, exclusions, limits reached
- **Claim Statuses**: pending, approved, denied, under investigation

### AI Response Format

The AI returns structured JSON responses:

```json
{
  "message": "I've added the necessary tasks for processing a car accident claim.",
  "modifications": [
    {
      "type": "add_node",
      "data": {
        "id": "node_123",
        "name": "Verify Policy Coverage",
        "type": "custom",
        "position": { "x": 200, "y": 150 },
        "variables": { "claimType": "car_accident", "policyNumber": "" }
      }
    },
    {
      "type": "connect_nodes",
      "data": { "source": "node_123", "target": "node_456" }
    }
  ]
}
```
