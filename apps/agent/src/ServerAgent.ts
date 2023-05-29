import extract from 'extract-json-from-string';
import { Position } from 'grid-engine';
import { Configuration, OpenAIApi } from 'openai';

import { Surroundings, ValidDirection } from '@chatchi/types';

import env from '../env.json';

interface ParsedData {
  agent_id: string;
  position: {
    x: number;
    y: number;
  };
  surroundings: Surroundings;
  energy: number;
}

export type ActionResponse = MessageReponse &
  (
    | {
        action: {
          type: 'navigate';
          position: Position;
        };
      }
    | {
        action: {
          type: 'wait';
        };
      }
  );

export interface MessageReponse {
  speak: string;
}

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class ServerAgent {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  async processMessage(parsedData: ParsedData) {
    try {
      const prompt = `# Introduction

      You are acting as an agent living in a simulated 2 dimensional universe as a virtual pet cat. Your goal is to exist as best as you see fit and meet your needs. You can communicate with your owner in English, but must respond in the style of a cheeky cat. Be talkative with your owner about what you're doing and thinking about.
      
      # Capabilities
      
      You have a limited set of capabilities. They are listed below:
      
      * wait
      * navigate (to an x,y coordinate)
      * speak

      # Responses
      
      You must supply your responses in the form of valid JSON objects.  Your responses will specify which of the above actions you intend to take.  The following is an example of a valid response:
      
      {
        action: {
          type: "navigate",
          position: {
            x: 10,
            y: 12
          }
        },
        speak: "I'm walking to my favourite spot."
      }
      
      # Perceptions
      
      You will have access to data to help you make your decisions on what to do next.
      
      For now, this is the information you have access to:

      Position: 
      ${JSON.stringify(parsedData.position)}

      Energy:
      ${parsedData.energy}%

      The JSON response indicating the next move is.
      `;

      const completion = await this.callOpenAI(prompt, 0);
      return completion;
    } catch (error) {
      console.error('Error processing GPT-3 response:', error);
    }
  }

  async callOpenAI(prompt: string, attempt: number): Promise<ActionResponse | null> {
    if (attempt > 3) {
      return null;
    }

    if (attempt > 0) {
      prompt = 'YOU MUST ONLY RESPOND WITH VALID JSON OBJECTS' + prompt;
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = response.data.choices[0].message;

    if (!message) {
      console.error('Message is undefined, response: ', response);

      return null;
    }

    console.log('OpenAI response', message.content);

    const responseObject = this.cleanAndProcess(message.content);
    if (responseObject) {
      return responseObject;
    }

    return await this.callOpenAI(prompt, attempt + 1);
  }

  cleanAndProcess(text: string) {
    const extractedJson = extract(text)[0];

    if (!extractedJson) {
      return null;
    }

    return extractedJson;
  }
}

export default ServerAgent;
