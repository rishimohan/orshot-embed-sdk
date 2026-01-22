<template>
  <div ref="container" :class="className" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import {
  OrshotEmbed,
  type OrshotEmbedOptions,
  type EventMap,
} from "@orshot/embed";

const props = defineProps<{
  embedId?: string;
  templateId?: string | number;
  modifications?: Record<string, any>;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: Record<string, any>;
  url?: string;
}>();

const emit = defineEmits<{
  (e: "template:create", data: EventMap["template:create"]): void;
  (e: "template:update", data: EventMap["template:update"]): void;
  (e: "template:content", data: EventMap["template:content"]): void;
  (e: "download:png", data: EventMap["download:png"]): void;
  (e: "download:jpeg", data: EventMap["download:jpeg"]): void;
  (e: "download:webp", data: EventMap["download:webp"]): void;
  (e: "download:pdf", data: EventMap["download:pdf"]): void;
  (e: "download:html", data: EventMap["download:html"]): void;
  (e: "error", data: EventMap["error"]): void;
}>();

const container = ref<HTMLElement | null>(null);
let embedInstance: OrshotEmbed | null = null;

const containerStyle = computed(() => ({
  width:
    typeof props.width === "number"
      ? `${props.width}px`
      : props.width || "100%",
  height:
    typeof props.height === "number"
      ? `${props.height}px`
      : props.height || "100%",
  ...props.style,
}));

onMounted(() => {
  if (!container.value) return;

  embedInstance = new OrshotEmbed({
    embedId: props.embedId,
    templateId: props.templateId,
    modifications: props.modifications,
    width: "100%",
    height: "100%", // Handled by container
    url: props.url,
  });

  embedInstance.mount(container.value);

  // Bind events
  embedInstance.on("template:create", (data) => emit("template:create", data));
  embedInstance.on("template:update", (data) => emit("template:update", data));
  embedInstance.on("template:content", (data) =>
    emit("template:content", data),
  );
  embedInstance.on("download:png", (data) => emit("download:png", data));
  embedInstance.on("download:jpeg", (data) => emit("download:jpeg", data));
  embedInstance.on("download:webp", (data) => emit("download:webp", data));
  embedInstance.on("download:pdf", (data) => emit("download:pdf", data));
  embedInstance.on("download:html", (data) => emit("download:html", data));
  embedInstance.on("error", (data) => emit("error", data));
});

onBeforeUnmount(() => {
  if (embedInstance) {
    embedInstance.destroy();
  }
});

// Watchers for dynamic updates
watch(
  () => props.templateId,
  (newId) => {
    if (embedInstance && newId) {
      embedInstance.setTemplate(newId);
    }
  },
);

watch(
  () => props.modifications,
  (newMods) => {
    if (embedInstance && newMods) {
      embedInstance.setModifications(newMods);
    }
  },
  { deep: true },
);

// Expose methods to parent
defineExpose({
  setTemplate: (id: string | number) => embedInstance?.setTemplate(id),
  setModifications: (mods: Record<string, any>) =>
    embedInstance?.setModifications(mods),
  requestContent: (
    format: "png" | "pdf" | "html" = "png",
    options: { scale?: number } = {},
  ) => embedInstance?.requestContent(format, options),
  send: (type: string, payload?: any) => embedInstance?.send(type, payload),
});
</script>
