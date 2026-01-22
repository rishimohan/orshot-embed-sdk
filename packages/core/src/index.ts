import { EMBED_EVENTS, DEFAULT_EMBED_URL } from "./constants";
import { OrshotEmbedOptions, EventMap, EventHandler } from "./types";

export class OrshotEmbed {
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLElement | null = null;
  private options: OrshotEmbedOptions;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private cleanupListener: (() => void) | null = null;

  constructor(options: OrshotEmbedOptions) {
    this.options = {
      width: "100%",
      height: "100%",
      url: DEFAULT_EMBED_URL,
      ...options,
    };
  }

  /**
   * Mounts the iframe into the specified container
   */
  mount(container: HTMLElement) {
    if (this.iframe) {
      console.warn("OrshotEmbed is already mounted.");
      return;
    }

    this.container = container;
    this.iframe = document.createElement("iframe");
    
    // Construct URL
    const baseUrl = this.options.embedId 
      ? `${this.options.url}/${this.options.embedId}`
      : this.options.url || DEFAULT_EMBED_URL;
      
    const url = new URL(baseUrl);
    
    if (this.options.templateId) {
      url.searchParams.set("templateId", String(this.options.templateId));
    }

    // Apply styles
    this.iframe.src = url.toString();
    this.iframe.style.border = "none";
    this.iframe.style.width = typeof this.options.width === 'number' ? `${this.options.width}px` : this.options.width!;
    this.iframe.style.height = typeof this.options.height === 'number' ? `${this.options.height}px` : this.options.height!;
    
    if (this.options.className) {
      this.iframe.className = this.options.className;
    }

    if (this.options.style) {
      Object.assign(this.iframe.style, this.options.style);
    }

    container.appendChild(this.iframe);
    this.setupMessageListener();

    // If modifications are provided, wait for load then send them
    if (this.options.modifications) {
      this.iframe.onload = () => {
        this.setModifications(this.options.modifications!);
      };
    }
  }

  /**
   * Set up the global message listener
   */
  private setupMessageListener() {
    const handler = (event: MessageEvent) => {
      // Security check: You might want to validate origin strictly here
      // if (event.origin !== "https://orshot.com") return;
      
      if (!event.data || typeof event.data !== "object") return;
      
      const { type, data } = event.data;
      
      // Map internal event types to SDK event names
      const eventKey = Object.entries(EMBED_EVENTS).find(([_, value]) => value === type)?.[0];
      
      if (!eventKey) return; 

      // Transform "corshot:template:create" -> "template:create" (internal mapping logic)
      // Actually, let's just map based on the event string suffix or specific map
      
      let sdkEventName = "";
      
      if (type === EMBED_EVENTS.TEMPLATE_CREATE) sdkEventName = "template:create";
      else if (type === EMBED_EVENTS.TEMPLATE_UPDATE) sdkEventName = "template:update";
      else if (type === EMBED_EVENTS.TEMPLATE_CONTENT) sdkEventName = "template:content";
      else if (type === EMBED_EVENTS.DOWNLOAD_PNG) sdkEventName = "download:png";
      else if (type === EMBED_EVENTS.DOWNLOAD_JPEG) sdkEventName = "download:jpeg";
      else if (type === EMBED_EVENTS.DOWNLOAD_WEBP) sdkEventName = "download:webp";
      else if (type === EMBED_EVENTS.DOWNLOAD_PDF) sdkEventName = "download:pdf";
      else if (type === EMBED_EVENTS.DOWNLOAD_HTML) sdkEventName = "download:html";
      else if (type === EMBED_EVENTS.ERROR) sdkEventName = "error";

      if (sdkEventName) {
        this.emit(sdkEventName, data);
      }
    };

    window.addEventListener("message", handler);
    this.cleanupListener = () => window.removeEventListener("message", handler);
  }

  /**
   * Generic method to subscribe to events
   */
  on<K extends keyof EventMap>(event: K, callback: EventHandler<EventMap[K]>) {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }
    this.listeners.get(event as string)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from events
   */
  off<K extends keyof EventMap>(event: K, callback: EventHandler<EventMap[K]>) {
    const callbacks = this.listeners.get(event as string);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit event internally to subscribers
   */
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  /**
   * Send a raw message to the iframe
   */
  send(type: string, payload: any = {}) {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.warn("OrshotEmbed: Iframe not ready");
      return;
    }
    this.iframe.contentWindow.postMessage({ type, ...payload }, "*");
  }

  // --- Control Methods ---

  /**
   * Switch to a specific template
   */
  setTemplate(templateId: string | number) {
    this.send(EMBED_EVENTS.CONTROL, { templateId });
  }

  /**
   * Update layer modifications
   */
  setModifications(modifications: Record<string, any>) {
    this.send(EMBED_EVENTS.CONTROL, { modifications });
  }

  /**
   * Request template content
   */
  requestContent(format: 'png' | 'pdf' | 'html' = 'png', options: { scale?: number } = {}) {
    const requestId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    this.send(EMBED_EVENTS.REQUEST_TEMPLATE, { 
      format, 
      requestId, 
      options 
    });
  }

  /**
   * Cleanup everything
   */
  destroy() {
    if (this.cleanupListener) {
      this.cleanupListener();
    }
    if (this.iframe && this.container) {
      this.container.removeChild(this.iframe);
    }
    this.iframe = null;
    this.container = null;
    this.listeners.clear();
  }
}

export * from "./types";
export * from "./constants";
