import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginRequireTransform from 'vite-plugin-require-transform'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginRequireTransform({
      fileRegex:/.js$|.vue$/,
    })

  ],
})
