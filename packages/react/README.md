# @orshot/embed-react

Official React component for embedding Orshot Studio into your application.

## Installation

```bash
npm install @orshot/embed-react
# or
pnpm add @orshot/embed-react
# or
yarn add @orshot/embed-react
```

## Basic Usage

```jsx
import { OrshotEmbed } from "@orshot/embed-react";

function DesignEditor() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <OrshotEmbed
        embedId="your-embed-id"
        // Optional: Load a specific template on mount
        templateId="456"
        // Optional: Pre-fill variables
        modifications={{
          title: "Hello World",
          hero_image: "https://example.com/photo.jpg",
        }}
        // Event Handlers
        onTemplateCreate={(data) => console.log("Created!", data)}
        onDownloadPng={(data) => console.log("Downloaded PNG", data.content)}
      />
    </div>
  );
}
```

## Advanced Control (`useRef`)

You can control the embed programmatically using a ref.

```jsx
import { useRef } from "react";
import { OrshotEmbed } from "@orshot/embed-react";

function App() {
  const embedRef = useRef(null);

  const handleSwitch = () => {
    // Switch template without reloading iframe
    embedRef.current?.setTemplate("789");
  };

  const handleUpdate = () => {
    // Update variables dynamically
    embedRef.current?.setModifications({ title: "New Title" });
  };

  const handleDownload = () => {
    // Request a download (if enabled)
    embedRef.current?.requestContent("png");
  };

  return (
    <>
      <button onClick={handleSwitch}>Switch Template</button>
      <button onClick={handleUpdate}>Update Text</button>
      <button onClick={handleDownload}>Download PNG</button>

      <OrshotEmbed ref={embedRef} embedId="your-embed-id" />
    </>
  );
}
```

## Hook Usage (`useOrshotEmbed`)

For custom integrations where you want to render the iframe yourself (e.g., in a portal).

```jsx
import { useOrshotEmbed } from "@orshot/embed-react";

function Custom() {
  const { containerRef, setModifications } = useOrshotEmbed({
    embedId: "your-embed-id",
    onTemplateUpdate: (data) => console.log("Saved", data),
  });

  return <div ref={containerRef} style={{ height: 500 }} />;
}
```

## Props API

| Prop            | Type               | Description                                          |
| :-------------- | :----------------- | :--------------------------------------------------- |
| `embedId`       | `string`           | The ID of your embed key (required).                 |
| `templateId`    | `string \| number` | Initial template to load.                            |
| `modifications` | `object`           | Initial key-value pairs to override template layers. |
| `className`     | `string`           | CSS class for the wrapper div.                       |
| `style`         | `object`           | Inline styles for the wrapper div.                   |
| `url`           | `string`           | Override the default embed base URL.                 |

### Event Handlers

| Prop               | Callback Data         | Description                                         |
| :----------------- | :-------------------- | :-------------------------------------------------- |
| `onTemplateCreate` | `{ id, name }`        | Fired when a new template is created/saved as copy. |
| `onTemplateUpdate` | `{ id, name }`        | Fired when an existing template is saved.           |
| `onDownloadPng`    | `{ content: string }` | Fired on PNG download (content is base64).          |
| `onDownloadPdf`    | `{ content: string }` | Fired on PDF download.                              |
| `onDownloadHtml`   | `{ content: string }` | Fired on HTML download.                             |
| `onError`          | `{ message, code }`   | Fired on errors (e.g. plan limits).                 |

## License

MIT © [Orshot](https://orshot.com)
