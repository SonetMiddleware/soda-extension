import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.API_HOST': 'https://testapi2.platwin.io:49336/api/v1', // 'https://testapi2.platwin.io/api/v1',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  locale: { default: 'en-US' },
  extensions: {
    name: 'Soda',
    description:
      'A personal asset portal for the Web. Build a socially forward metaverse where assets derive value from communal activity.',
    optionsUI: {
      page: '@/pages/options',
      openInTab: true,
    },
    background: { scripts: ['@/background/index'], persistent: false },
    popupUI: '@/pages/popup',
    contentScripts: [
      {
        matches: ['https://twitter.com/*'],
        entries: ['@/injectedScripts', '@/contentScripts/twitter'],
      },
      {
        matches: ['https://www.facebook.com/*'],
        entries: ['@/contentScripts/facebook', '@/injectedScripts'],
      },
      {
        matches: ['http://*/*', 'https://*/*'],
        entries: ['@/contentScripts/index.ts'],
      },
    ],
    icons: {
      16: 'logo/sodalogo@16.png',
      32: 'logo/sodalogo@32.png',
      48: 'logo/sodalogo@48.png',
      128: 'logo/sodalogo@128.png',
    },
    permissions: ['storage', 'tabs'],
    extends: {
      web_accessible_resources: ['injected.js', 'images/*.png'],
    },
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/core',
        // Use "'libraryDirectory': ''," if your bundler does not support ES modules
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/lab',
        // Use "'libraryDirectory': ''," if your bundler does not support ES modules
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'lab',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/icons',
        // Use "'libraryDirectory': ''," if your bundler does not support ES modules
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'icons',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
});
