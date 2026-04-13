import type { AIServiceResponse, WorkflowModification } from "@/types/domain";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/utils/aiassist";

export type AIServiceType = "openai";

export class AiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = "https://api.openai.com/v1";
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private createSystemPrompt(): string {
    return SYSTEM_PROMPT;
  }

  private createUserPrompt(userMessage: string, workflowJSON: string): string {
    return `User Request: "${userMessage}" 
      Current Workflow State: ${workflowJSON} 
      ${USER_PROMPT}`;
  }

  async processWorkflowModification(
    query: string,
    workflowJSON: string,
  ): Promise<AIServiceResponse> {
    if (!this.apiKey) {
      return Promise.resolve({
        message:
          "Please set your OpenAI API key in the settings to use the AI assistant.",
        success: false,
      });
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.4-mini",
          messages: [
            {
              role: "system",
              content: this.createSystemPrompt(),
            },
            {
              role: "user",
              content: this.createUserPrompt(query, workflowJSON),
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      const { message, modifications } = await this.parseAIResponse(content);
      return {
        message,
        modifications,
        success: true,
      };
    } catch {
      return {
        message: "Error processing your request",
        success: false,
      };
    }
  }

  async parseAIResponse(
    response: string,
  ): Promise<{ message: string; modifications: WorkflowModification[] }> {
    try {
      // Validate JSON structure before parsing
      if (!response.startsWith('{') || !response.endsWith('}')) {
        throw new Error("JSON doesn't start with { and end with }");
      }
      const parsed = JSON.parse(response);
      return {
        message: parsed?.message ?? response,
        modifications: parsed?.modifications ?? [],
      };
    } catch {
      // Return the raw response as message if parsing fails
      return { 
        message: response, 
        modifications: [] 
      };
    }
  }
}

export const aiService = new AiService();
