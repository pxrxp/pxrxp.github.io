// @ts-check
import { defineConfig } from 'astro/config';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import mdx from '@astrojs/mdx';

import mermaid from 'astro-mermaid';

import react from '@astrojs/react';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [mdx(), mermaid(), react()]
});