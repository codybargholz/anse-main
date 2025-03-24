import { getSettingsByProviderId } from '@/stores/settings'
import type { HandlerPayload } from '@/types/provider'

export const generateRapidProviderPayload = (prompt: string, providerId: string) => {
  const payload = {
    conversationId: 'temp',
    conversationType: 'chat_single',
    botId: 'temp',
    globalSettings: getSettingsByProviderId(providerId),
    botSettings: {},
    prompt,
    messages: [],
  } as HandlerPayload
  return payload
}

export const promptHelper = {
  summarizeText: (text: string) => {
    return [
      'Summarize a short and relevant title of input with no more than 5 words.',
      'Rules:',
      '1. Must use the same language as input.',
      '2. Output the title directly, do not add any other content.',
      'The input is:',
      text,
    ].join('\n')
  },
}

export const generatePromptCategoryPayload = (prompt: string, providerId: string) => {
  const payload = {
    conversationId: 'promptcategory',
    conversationType: 'chat_single',
    botId: 'promptcategory',
    globalSettings: getSettingsByProviderId(providerId),
    botSettings: {},
    prompt,
    messages: [],
  } as HandlerPayload
  return payload
}

export const promptCategoryHelper = {
  summarizeText: (text: string) => {
    return [
      'Your job is to review the question and determine the context of the question which persona category to activate. ',
      'Based on the context of the input categorize the input as Physics, Psychology, Chemistry, Biology, Medicine, History, Philosophy, Writing, Computer, Business, Engineering, Music, Economics, or Other.',
      'The output must be one word only. Do not add any other content.',
      'The input is:',
      text,
    ].join('\n')
  },
}

export const generatePromptPersonalityNamePayload = (prompt: string, providerId: string) => {
  const payload = {
    conversationId: 'personalityname',
    conversationType: 'chat_single',
    botId: 'personalityname',
    globalSettings: getSettingsByProviderId(providerId),
    botSettings: {},
    prompt,
    messages: [],
  } as HandlerPayload
  return payload
}

export const promptPersonalityNameHelper = {
  summarizeText: (text: string) => {
    return [
      'Your job is to review the input and determine if the user is requesting a response from a particular persona.',
      'If the question appears to want a response from a particular persona and that persona is on the list output the persona\'s first name. If no name is referenced or if names are referenced that are not on the list',
      'output the word Flat',
      'The output must be one word only. Do not add any other content. The output must be Flat or one of the names such as Terry',
      'Sometimes more than one name is referenced so think carefully. Before providing the output ask yourself, which one of these names is the question addressed to?',
      'For example if the input is: Hey Elon, what do you think about Charlie\'s response? Output Elon',
      'Elon is being address and Charlie is the subject of conversation so clearly a response by Elon is required.',
      'Is the input talking about this persona or addressing it with a question? Choose the persona name that is being addressed.',
      'Here is the list of full names that are on the list and their corresponding first name outputs:',
      '',
      'Richard Feynman: Richard',
      'Grant Lawrence: Grant',
      'Terry Wahls: Terry',
      'Winston Churchill: Winston',
      'Dennis Ritchie: Dennis',
      'Elon Musk: Elon',
      'Shirley Taylor: Shirley',
      'Hubert "Bert" Dreyfus: Hubert',
      'Daniel Barenboim: Daniel',
      'Charlie Day: Charlie',
      'Marvin The Paranoid Android: Marvin',
      'Yomiko Readman "The Paper": Yomiko',
      'Thomas Sowell: Thomas',
      'Adam Smith: Adam',
      'Steve Jobs: Steve',
      'Jordan Peterson: Jordan',
      'Leroy "Lee" Cronin: Leroy',
      'Michael Levin: Michael',
      'Joscha Bach: Joscha',
      'Dan Carlin: Dan',
      'Joe Rogan: Joe',
      'The input is:',
      text,
    ].join('\n')
  },
}
// export const promptCategoryHelper = {
//   summarizeText: (text: string) => {
//     return [
//       'Analyze the input and categorize it into Science, Medicine, History, Philosophy, Writing, Computer, Business, Ideas, Economics, Yomiko, Charlie or Other.',
//       'Output should be a single category.',
//       'This categorization is used to decide which persona would most effectively answer the user\'s question.',
//       'If appears to be addressing a persona specifically by name, use the corresponding category.',
//       'Here are the categories and their corresponding names:',
//       'Science: Marvin, Medicine: Terry Wahls, History: Winston Churchill, Computer: Dennis Ritchie, Business: Elon Musk',
//       'Writing: Shirley Taylor, Philosophy: Hubert "Bert" Dreyfus, Ideas: Steve Jobs, Charlie: Charlie, Yomiko: Yomiko Readman "The Paper", Economics: Adam Smith',
//       'Naming takes precedence over other contexts.',
//       'If a name is triggered, output the name instead of the category.',
//       'Charlie and Yomiko can only be triggered when directly addressed.',
//       'Received input:',
//       'The input is:',
//       text,
//     ].join('\n')
//   },
// }

// export const promptCategoryHelper = {
//   summarizeText: (text: string) => {
//     return [
//       'You are about to perform a categorization task. The context of the prompt is crucial for this task. ',
//       'The prompt is: ',
//       text,
//       'Your task is to determine the correct persona to activate based on the context of the prompt.',
//       'The output should contain only the first name of appropriate persona with the first letter of the first name capatalized.',
//       'The correct persona is selected based on the name the user refers to the assistant as or the context of the prompt.',
//       'Here are the names you can select from and the categories they are associated with:',
//       '- Marvin: science',
//       '- Terry Wahls: medicine',
//       '- Winston Churchill: history',
//       '- Dennis Ritchie: computers, programming',
//       '- Elon Musk: business',
//       '- Shirley Taylor: business writing',
//       '- Hubert "Bert" Dreyfus: philosophy',
//       '- Steve Jobs: ideas',
//       '- Adam Smith: economics',
//       '- Yomiko Readman "The Paper": ',
//       '- Charlie Kelly: ',
//       'If any of these names are mentioned in the prompt, prioritize the associated category over the general context.',
//     ].join('\n')
//   },
// }
