export const EMBED_EVENTS = {
  TEMPLATE_CREATE: "orshot:template:create",
  TEMPLATE_UPDATE: "orshot:template:update",
  TEMPLATE_CONTENT: "orshot:template:content",
  DOWNLOAD_PNG: "orshot:download:png",
  DOWNLOAD_JPEG: "orshot:download:jpeg",
  DOWNLOAD_WEBP: "orshot:download:webp",
  DOWNLOAD_PDF: "orshot:download:pdf",
  DOWNLOAD_HTML: "orshot:download:html",
  ERROR: "orshot:error",
  // Outgoing
  REQUEST_TEMPLATE: "orshot:request:template",
  CONTROL: "orshot:embed:control",
} as const;

export const DEFAULT_EMBED_URL = "https://orshot.com/embeds";
