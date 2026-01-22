# Orshot Embed SDKs

Official SDKs to freely embed Orshot Studio into your web application.

- **[Core SDK](packages/core)**: Framework-agnostic vanilla JS/TS library.
- **[React SDK](packages/react)**: Components and Hooks for React.
- **[Vue SDK](packages/vue)**: Components for Vue 3.

## Documentation

Full documentation is available at [docs.orshot.com](https://docs.orshot.com/orshot-embed).

## Features

- ⚛️ **Framework Ready**: Native wrappers for React and Vue (more coming).
- 🛡️ **Type Safe**: Full TypeScript support with typed event payloads.
- 🔌 **Plug & Play**: Simple drop-in component.
- 🚀 **Scalable**: Built on a solid event-driven core.

## Quick Start (React)

```bash
npm install @orshot/embed-react
```

```jsx
import { OrshotEmbed } from '@orshot/embed-react';

function App() {
  return (
    <OrshotEmbed 
      embedId="your-embed-id"
      onTemplateCreate={(data) => console.log('Saved!', data)}
    />
  );
}
```

## Contributing

This repository is managed with `pnpm` workspaces and `turbo`.

1. Install dependencies: `pnpm install`
2. Run dev mode: `pnpm dev`
3. Build all: `pnpm build`

## License

MIT © [Orshot](https://orshot.com)
