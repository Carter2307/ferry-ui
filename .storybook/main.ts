import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  // Local story assets (placeholder avatars…), served from the root: `/avatars/portrait-1.svg`.
  staticDirs: ['./public'],
  typescript: {
    // Full prop tables, including props inherited from Radix / HTML elements.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent || !/node_modules\/(@types\/react|csstype)/.test(prop.parent.fileName),
    },
  },
}

export default config
