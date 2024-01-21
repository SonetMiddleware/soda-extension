import { defineConfig } from '@umijs/max';

export default defineConfig({
  outputPath: 'dist',
  plugins: [require.resolve('umi-plugin-extensions')],
  define: {
    'process.env.API_HOST': 'https://testapi2.platwin.io:49336/api/v1', // 'https://testapi2.platwin.io/api/v1',
  },

  locale: { default: 'en-US' },
  model: {},
  antd: {},
  request: {},
  extensions: {
    name: 'Soda',
    description:
      'A personal asset portal for the Web. Build a socially forward metaverse where assets derive value from communal activity.',
    optionsUI: {
      page: '@/pages/options',
      openInTab: true,
    },
    background: { service_worker: '@/background/index' },

    popupUI: '@/pages/popup',
    contentScripts: [
      // {
      //   matches: ['http://*/*', 'https://*/*'],
      //   entries: ['@/contentScripts/index.ts'],
      // },
      {
        matches: ['https://twitter.com/*', 'https://mobile.twitter.com/*'],
        entries: [
          '@/contentScripts/index.ts',
          '@/injectedScripts',
          '@/contentScripts/twitter',
        ],
      },
      {
        matches: ['https://www.facebook.com/*'],
        entries: [
          '@/contentScripts/index.ts',
          '@/injectedScripts',
          '@/contentScripts/facebook',
        ],
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
      web_accessible_resources: [
        {
          resources: [
            'injected.js',
            'inject-hook.umd.min.js',
            'images/*.png',
            'fonts/*.*',
          ],
          matches: ['https://twitter.com/*', 'https://www.facebook.com/*'],
        },
      ],
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
  copy: [
    {
      from: './src/injectedScripts/injected.js',
      to: './',
    },
    {
      from: '../soda-event-util/dist/inject-hook.umd.min.js',
      to: './',
    },
  ],
});
