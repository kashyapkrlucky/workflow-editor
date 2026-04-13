export type AIServiceType = 'openai';

export interface AIServiceResponse {
  message: string;
  success: boolean;
}
export class AiService {
  constructor() {
    console.log("AiService");
  }

  processUserQuery(query: string): Promise<AIServiceResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: `Let me think about that... you wants to ${query}`,
          success: true,
        });
      }, 1000);
    });
  }
}


export const aiService = new AiService();