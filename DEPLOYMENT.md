# Orshot Embed SDKs Deployment Guide

This repository contains the SDKs for Orshot Embed, managed as a monorepo using `pnpm` workspaces and `changesets` for versioning.

## Structure

- `packages/core`: The Vanilla JS/Typescript SDK (`@orshot/embed`). Contains all business logic.
- `packages/react`: React Component & Hook wrapper (`@orshot/embed-react`).
- `packages/vue`: Vue 3 Component wrapper (`@orshot/embed-vue`).

## Prerequisites

- Node.js 18+
- pnpm 8+
- NPM Registry Access (for publishing)

## Development Workflow

1.  **Install Dependencies**

    ```bash
    pnpm install
    ```

2.  **Dev Mode**
    Run all packages in watch mode:

    ```bash
    pnpm dev
    ```

3.  **Making Changes**
    - Apply your code changes in the respective package.
    - If you change `packages/core`, you likely want to verify `packages/react` and `packages/vue` still work as expected.

## Releasing Updates

We use [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs automatically.

### 1. Create a Changeset

When you have finished your changes and are ready to commit, run:

```bash
pnpm changeset
```

- Select the packages you modified (Space to select).
- Select semver bump type (Major/Minor/Patch).
- Enter a summary of the changes.

This will create a markdown file in the `.changeset` folder. Commit this file along with your code changes.

### 2. Versioning (CI/CD or Local)

To apply the changesets (bump versions in `package.json` and update `CHANGELOG.md`):

```bash
pnpm version-packages
```

Review the changes to `package.json` files and commit them:
`git commit -m "chore: version packages"`

### 3. Publishing to NPM

To publish all changed packages to the registry:

```bash
pnpm publish-packages
```

> Note: Ensure you are logged in to npm (`npm login`) and have the correct permissions for the `@orshot` scope.

## Scalability & Best Practices

- **Core Logic in @orshot/embed**: All iframe communication, postMessage handling, and event parsing should live in `packages/core`. The framework wrappers should be thin layers.
- **Protocol Agnostic**: The SDK is designed to be a "dumb pipe". It doesn't enforce business rules (like plan limits). It just facilitates communication. This means you rarely need to update the SDKs when you update the Embed App features.
- **Escape Hatches**: The SDK exposes a generic `.send()` method. If you add a new feature to the Embed App (e.g., `orshot:magic:resize`), users can use `ref.send('orshot:magic:resize')` immediately without waiting for a new SDK version.

## Adding a New Framework

To add Svelte, Angular, etc.:

1.  Create `packages/svelte`.
2.  Add `package.json` with `@orshot/embed` as a dependency.
3.  Create a wrapper component that:
    - Mounts the `OrshotEmbed` class on mount.
    - Destroys it on unmount.
    - Syncs props (like `templateId`) to `instance.setTemplate()`.
    - Forwards events.
