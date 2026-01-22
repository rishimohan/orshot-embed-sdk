# @orshot/embed-vue

Official Vue 3 component for embedding Orshot Studio into your application.

## Installation

```bash
npm install @orshot/embed-vue
# or
pnpm add @orshot/embed-vue
# or
yarn add @orshot/embed-vue
```

## Basic Usage

```vue
<script setup>
import { OrshotEmbed } from "@orshot/embed-vue";

const handleCreate = (data) => {
  console.log("Template Created:", data);
};
</script>

<template>
  <div class="editor-container">
    <OrshotEmbed
      embedId="your-embed-id"
      templateId="456"
      :modifications="{ title: 'Hello Vue' }"
      @template:create="handleCreate"
      @download:png="(data) => console.log('PNG', data.content)"
    />
  </div>
</template>

<style>
.editor-container {
  width: 100%;
  height: 600px;
}
</style>
```

## Advanced Control (`ref`)

You can control the embed programmatically using a component ref.

```vue
<script setup>
import { ref } from "vue";
import { OrshotEmbed } from "@orshot/embed-vue";

const embedRef = ref(null);

const switchTemplate = () => {
  // Switch template without reloading iframe
  embedRef.value?.setTemplate("789");
};

const updateText = () => {
  // Update variables dynamically
  embedRef.value?.setModifications({ title: "New Title" });
};

const download = () => {
  // Request content programmatically
  embedRef.value?.requestContent("png");
};
</script>

<template>
  <div>
    <button @click="switchTemplate">Switch Template</button>
    <button @click="updateText">Update Text</button>
    <button @click="download">Download</button>

    <OrshotEmbed
      ref="embedRef"
      embedId="your-embed-id"
      class="h-[600px] w-full"
    />
  </div>
</template>
```

## Props API

| Prop            | Type               | Description                                          |
| :-------------- | :----------------- | :--------------------------------------------------- |
| `embedId`       | `String`           | The ID of your embed key (required).                 |
| `templateId`    | `String \| Number` | Initial template to load.                            |
| `modifications` | `Object`           | Initial key-value pairs to override template layers. |
| `width`         | `String \| Number` | Iframe width (default: '100%').                      |
| `height`        | `String \| Number` | Iframe height (default: '100%').                     |
| `url`           | `String`           | Override the default embed base URL.                 |

### Events

| Event              | Data           | Description                               |
| :----------------- | :------------- | :---------------------------------------- |
| `@template:create` | `{ id, name }` | Fired when a new template is created.     |
| `@template:update` | `{ id, name }` | Fired when an existing template is saved. |
| `@download:png`    | `{ content }`  | Fired on PNG download (base64).           |
| `@download:pdf`    | `{ content }`  | Fired on PDF download.                    |
| `@download:html`   | `{ content }`  | Fired on HTML download.                   |
| `@error`           | `{ message }`  | Fired on errors.                          |

## License

MIT © [Orshot](https://orshot.com)
