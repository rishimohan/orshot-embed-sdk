import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { OrshotEmbed as CoreEmbed, OrshotEmbedOptions, EventMap, EventHandler } from '@orshot/embed';

export interface OrshotEmbedProps extends OrshotEmbedOptions {
  onTemplateCreate?: EventHandler<EventMap['template:create']>;
  onTemplateUpdate?: EventHandler<EventMap['template:update']>;
  onTemplateContent?: EventHandler<EventMap['template:content']>;
  onDownloadPng?: EventHandler<EventMap['download:png']>;
  onDownloadJpeg?: EventHandler<EventMap['download:jpeg']>;
  onDownloadWebp?: EventHandler<EventMap['download:webp']>;
  onDownloadPdf?: EventHandler<EventMap['download:pdf']>;
  onDownloadHtml?: EventHandler<EventMap['download:html']>;
  onError?: EventHandler<EventMap['error']>;
  className?: string;
  style?: React.CSSProperties;
}

export type OrshotEmbedRef = {
  setTemplate: (id: string | number) => void;
  setModifications: (mods: Record<string, any>) => void;
  requestContent: (format?: 'png' | 'pdf' | 'html', options?: { scale?: number }) => void;
  send: (type: string, payload?: any) => void;
  instance: CoreEmbed | null;
};

export const useOrshotEmbed = (options: OrshotEmbedOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<CoreEmbed | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize core embed
    const embed = new CoreEmbed(options);
    embed.mount(containerRef.current);
    embedRef.current = embed;

    return () => {
      embed.destroy();
      embedRef.current = null;
    };
  }, [options.embedId, options.url]); // Re-mount only if major identity changes

  const setTemplate = (id: string | number) => embedRef.current?.setTemplate(id);
  const setModifications = (mods: Record<string, any>) => embedRef.current?.setModifications(mods);
  const requestContent = (format?: 'png' | 'pdf' | 'html', options?: { scale?: number }) => embedRef.current?.requestContent(format, options);
  const send = (type: string, payload?: any) => embedRef.current?.send(type, payload);

  return {
    containerRef,
    embedInstance: embedRef,
    setTemplate,
    setModifications,
    requestContent,
    send
  };
};

export const OrshotEmbed = forwardRef<OrshotEmbedRef, OrshotEmbedProps>(({
  className,
  style,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateContent,
  onDownloadPng,
  onDownloadJpeg,
  onDownloadWebp,
  onDownloadPdf,
  onDownloadHtml,
  onError,
  ...options
}, ref) => {
  const { containerRef, embedInstance, setTemplate, setModifications, requestContent, send } = useOrshotEmbed(options);

  // Sync event listeners
  useEffect(() => {
    const instance = embedInstance.current;
    if (!instance) return;

    const unsubs: (() => void)[] = [];

    if (onTemplateCreate) unsubs.push(instance.on('template:create', onTemplateCreate));
    if (onTemplateUpdate) unsubs.push(instance.on('template:update', onTemplateUpdate));
    if (onTemplateContent) unsubs.push(instance.on('template:content', onTemplateContent));
    if (onDownloadPng) unsubs.push(instance.on('download:png', onDownloadPng));
    if (onDownloadJpeg) unsubs.push(instance.on('download:jpeg', onDownloadJpeg));
    if (onDownloadWebp) unsubs.push(instance.on('download:webp', onDownloadWebp));
    if (onDownloadPdf) unsubs.push(instance.on('download:pdf', onDownloadPdf));
    if (onDownloadHtml) unsubs.push(instance.on('download:html', onDownloadHtml));
    if (onError) unsubs.push(instance.on('error', onError));

    return () => {
      unsubs.forEach(u => u());
    };
  }, [
    embedInstance.current, // Only re-bind if instance changes (which happens on mount)
    onTemplateCreate,
    onTemplateUpdate,
    onTemplateContent,
    onDownloadPng,
    onDownloadJpeg,
    onDownloadWebp,
    onDownloadPdf,
    onDownloadHtml,
    onError
  ]);

  // Sync props that can change dynamically without remounting
  useEffect(() => {
    if (options.templateId) {
       // Only if it changes from initial mount, handled by deps usually, 
       // but here we just ensure if props update we send command
       setTemplate(options.templateId);
    }
  }, [options.templateId]);

  useEffect(() => {
    if (options.modifications) {
      setModifications(options.modifications);
    }
  }, [options.modifications]);

  useImperativeHandle(ref, () => ({
    setTemplate,
    setModifications,
    requestContent,
    send,
    instance: embedInstance.current
  }));

  return React.createElement('div', {
    ref: containerRef,
    className,
    style: { width: options.width || '100%', height: options.height || '100%', ...style }
  });
});

OrshotEmbed.displayName = 'OrshotEmbed';
