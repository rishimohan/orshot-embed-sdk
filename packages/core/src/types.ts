export interface TemplateData {
  id: string | number;
  name?: string;
  [key: string]: any;
}

export interface DownloadData {
  content: string; // Base64 or Blob URL
  templateId: string | number;
  [key: string]: any;
}

export interface ErrorData {
  code?: string;
  message: string;
  [key: string]: any;
}

export interface OrshotEmbedOptions {
  embedId?: string; // The ID of your embed configuration
  templateId?: string | number; // Specific template to load
  modifications?: Record<string, any>; // Initial modifications
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  url?: string; // Override default embed URL
}

export type ContentFormat = 'png' | 'pdf' | 'html';

export interface ContentRequestOptions {
  scale?: number;
  [key: string]: any;
}

export type EventHandler<T = any> = (data: T) => void;

export type EventMap = {
  "template:create": TemplateData;
  "template:update": TemplateData;
  "template:content": any;
  "download:png": DownloadData;
  "download:jpeg": DownloadData;
  "download:webp": DownloadData;
  "download:pdf": DownloadData;
  "download:html": DownloadData;
  "error": ErrorData;
  [key: string]: any;
};
