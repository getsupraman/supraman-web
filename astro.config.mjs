import { defineConfig } from 'astro/config';
import cms from '@cms/kit';

export default defineConfig({
  integrations: [cms()],
});
