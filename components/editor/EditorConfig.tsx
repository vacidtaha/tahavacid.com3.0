// EditorJS veri tiplerini tanımlayan dosya

// EditorJS data ana tipini tanımla
export interface EditorJSData {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

// Genel blok tipi
export interface EditorJSBlock {
  id?: string;
  type: string;
  data: any;
}

// Paragraf bloğu
export interface EditorJSParagraphData {
  text: string;
}

// Başlık bloğu
export interface EditorJSHeaderData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// Görsel bloğu
export interface EditorJSImageData {
  file: {
    url: string;
    width?: number;
    height?: number;
  };
  caption?: string;
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
}

// Liste bloğu
export interface EditorJSListData {
  style: 'ordered' | 'unordered';
  items: string[];
}

// Alıntı bloğu
export interface EditorJSQuoteData {
  text: string;
  caption?: string;
  alignment?: 'left' | 'center';
}

// Kod bloğu
export interface EditorJSCodeData {
  code: string;
  language?: string;
}

// Tablo bloğu
export interface EditorJSTableData {
  content: string[][];
  withHeadings?: boolean;
}

// Gömülü içerik bloğu
export interface EditorJSEmbedData {
  embed: string;
  caption?: string;
  width?: number;
  height?: number;
}

// İşaretleme listesi bloğu
export interface EditorJSChecklistData {
  items: {
    text: string;
    checked: boolean;
  }[];
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