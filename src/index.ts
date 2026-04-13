import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WorkflowEditor } from './WorkflowEditor';

interface AIConfig {
  apiKey?: string;
  model: string;
}

class WorkflowEditorWebComponent extends HTMLElement {
  private root: Root | null = null;
  private shadow: ShadowRoot;
  private aiConfig: AIConfig = { model: 'gpt-5.4-mini' };

  static get observedAttributes() {
    return ['api-key', 'model'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadow = this.shadowRoot!;
  }

  connectedCallback() {
    this.updateConfig();
    this.loadStyles();
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this.updateConfig();
    this.render();
  }

  private updateConfig() {
    const apiKey = this.getAttribute('api-key');
    const model = this.getAttribute('model') || 'gpt-5.4-mini';
    
    this.aiConfig = {
      apiKey: apiKey || undefined,
      model
    };
  }

  private loadStyles() {
    // Load CSS file - it should be in the same directory as the JS file
    fetch('./workflow-editor.css')
      .then(response => response.text())
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadow.appendChild(style);
      })
      .catch(error => {
        console.error('Failed to load styles:', error);
      });
  }

  private render() {
    if (!this.root) {
      this.root = createRoot(this.shadow);
    }

    this.root.render(React.createElement(WorkflowEditor, { aiConfig: this.aiConfig }));
  }
}

// Define the custom element
customElements.define('workflow-editor', WorkflowEditorWebComponent);

// Export for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'workflow-editor': WorkflowEditorWebComponent;
  }
}
