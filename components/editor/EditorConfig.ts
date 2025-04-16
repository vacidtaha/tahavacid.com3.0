// Editor.js için araç tipleri için type tanımlamaları
export interface EditorJSConfig {
  holder: string;
  tools: Record<string, any>;
  data?: any;
  onChange?: (api: any, event: any) => void;
  onReady?: () => void;
  autofocus?: boolean;
  placeholder?: string;
  inlineToolbar?: boolean | string[];
  readOnly?: boolean;
}

export interface EditorJSData {
  time: number;
  blocks: Array<{
    type: string;
    data: Record<string, any>;
  }>;
  version: string;
}

// Standart boş içerik şablonu
export const EMPTY_EDITOR_DATA: EditorJSData = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: ""
      }
    }
  ],
  version: "2.28.2"
}; 