import { JovoResponse, SessionData, SpeechBuilder } from 'jovo-core';
import { Message, TextMessage } from '..';

export interface MessengerBotResponseJSON {
  message?: Message;
}

export class MessengerBotResponse implements JovoResponse {
  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? MessengerBotResponse.fromJSON(value) : value;
  }

  static fromJSON(json: MessengerBotResponseJSON | string): MessengerBotResponse {
    if (typeof json === 'string') {
      return JSON.parse(json, MessengerBotResponse.reviver);
    }

    const response = Object.create(MessengerBotResponse.prototype);
    return Object.assign(response, json);
  }

  messages: Message[] = [];

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getSessionAttributes(): SessionData | undefined {
    return undefined;
  }

  getSessionData(): SessionData | undefined {
    return undefined;
  }

  getSpeech(): string | undefined {
    return this.getSpeechPlain();
  }

  getSpeechPlain(separator?: string): string | undefined {
    return this.messages
      .map((m) => {
        if (m instanceof TextMessage) {
          return m.message.text;
        }
        return;
      })
      .filter((m) => !!m)
      .join(separator || ' ');
  }

  hasSessionAttribute(name: string, value?: any): boolean {
    return false;
  }

  hasSessionData(name: string, value?: any): boolean {
    return false;
  }

  hasSessionEnded(): boolean {
    return true;
  }

  hasState(state: string): boolean | undefined {
    return undefined;
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    return this.isTell(speechText);
  }

  isTell(speechText?: string | string[]): boolean {
    if (!speechText || !this.messages.length) {
      return false;
    }

    const textMessages = this.messages
      .map((m) => (m as TextMessage)?.message?.text)
      .filter((m) => !!m);

    if (typeof speechText === 'string') {
      return textMessages.includes(SpeechBuilder.removeSSML(speechText));
    }

    if (Array.isArray(speechText)) {
      return speechText.some((text) => {
        return textMessages.includes(SpeechBuilder.removeSSML(text));
      });
    }

    return false;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this;
  }
}
