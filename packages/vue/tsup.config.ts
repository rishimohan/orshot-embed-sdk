import { defineConfig } from 'tsup';import vue from 'esbuild-plugin-vue';export default defineConfig({  entry: ['src/index.ts'],  format: ['cjs', 'esm'],  dts: false,  splitting: false,  sourcemap: true,  clean: true,  external: ['vue'],  esbuildPlugins: [vue()],  define: {    '__VUE_OPTIONS_API__': '"true"',
    '__VUE_PROD_DEVTOOLS__': '"false"',
  },
});
