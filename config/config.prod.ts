import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.API_HOST': 'https://testapi2.platwin.io:49336/api/v1', // 'https://testapi2.platwin.io/api/v1',
  },
});
