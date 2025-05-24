import {
  handlePrompt,
  handlePromptCategory,
  handlePromptName,
  handleRapidPrompt,
} from './handler'
import type { Provider } from '@/types/provider'

const providerOpenAI = () => {
  const provider: Provider = {
    id: 'provider-openai',
    icon: 'i-simple-icons-openai', // @unocss-include
    name: 'OpenAI',
    globalSettings: [
      {
        key: 'apiKey',
        name: 'API Key',
        type: 'api-key',
      },
      {
        key: 'baseUrl',
        name: 'Base URL',
        description: 'Custom base url for OpenAI API.',
        type: 'input',
        default: 'https://api.openai.com',
      },
      {
        key: 'model',
        name: 'OpenAI model',
        description: 'Select the OpenAI model. Reasoning models (o-series) excel at complex problem-solving but may be slower.',
        type: 'select',
        options: [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo - Fast & economical' },
          { value: 'gpt-4o', label: 'GPT-4o - Multimodal flagship' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo - Previous generation' },
          { value: 'gpt-4.1', label: 'GPT-4.1 - Latest with 1M context' },
          { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini - Fast & efficient' },
          { value: 'o3', label: 'o3 - Advanced reasoning model' },
          { value: 'o4-mini', label: 'o4-mini - Fast reasoning model' },
          { value: 'o3-mini', label: 'o3-mini - Efficient reasoning' },
        ],
        default: 'gpt-4.1',
      },
      {
        key: 'maxTokens',
        name: 'Max Tokens',
        description: 'The maximum number of tokens to generate in the completion.',
        type: 'slider',
        min: 0,
        max: 1000000,
        default: 4096,
        step: 1,
      },
      {
        key: 'temperature',
        name: 'Temperature',
        type: 'slider',
        description: 'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
        min: 0,
        max: 1,
        default: 0.7,
        step: 0.01,
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: 'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.',
        type: 'slider',
        min: 0,
        max: 1,
        default: 1,
        step: 0.01,
      },
    ],
    bots: [
      {
        id: 'chat_continuous',
        type: 'chat_continuous',
        name: 'Chat',
        settings: [],
      },
      /*
      {
        id: 'chat_single',
        type: 'chat_single',
        name: 'Single Chat',
        settings: [],
      },
      {
        id: 'image_generation',
        type: 'image_generation',
        name: 'DALL·E',
        settings: [],
      },
      */
    ],
    handlePrompt,
    handleRapidPrompt,
    handlePromptCategory,
    handlePromptName,
  }
  return provider
}

export default providerOpenAI
