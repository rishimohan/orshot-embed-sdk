<template>
  <div ref="container" :class="className" :style="containerStyle"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { OrshotEmbed, OrshotEmbedOptions, EventMap } from "@orshot/embed";

const props = defineProps({
  embedId: { type: String, required: false },
  templateId: { type: [String, Number], required: false },
  modifications: { type: Object, required: false },
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  className: { type: String, required: false },
  style: { type: Object, required: false },
  url: { type: String, required: false },
});

const emit = defineEmits([
  "template:create",
  "template:update",
  "template:content",
  "download:png",
  "download:jpeg",
  "download:webp",
  "download:pdf",
  "download:html",
  "error",
]);

const container = ref(null);
let embedInstance = null;

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
  setTemplate: (id) => embedInstance?.setTemplate(id),
  setModifications: (mods) => embedInstance?.setModifications(mods),
  requestContent: (format = "png", options = {}) =>
    embedInstance?.requestContent(format, options),
  send: (type, payload) => embedInstance?.send(type, payload),
});
</script>
