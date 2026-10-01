import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { ThemeProvider, useTheme, type ThemePreference } from '../../theme/theme-provider'
import { ThemeMenu, type ThemeMenuProps } from './theme-menu'

/** Open-by-default menus render in their own iframe so the panel stays next to its trigger. */
const inFrame = (height: number) => ({ docs: { story: { inline: false, iframeHeight: `${height}px` } } })

/**
 * Keeps the chosen value in local state so the trigger icon follows the selection in the
 * canvas (the story's `value` control sets the initial preference).
 */
function StatefulThemeMenu({ value, onValueChange, ...props }: ThemeMenuProps) {
  const [current, setCurrent] = React.useState<ThemePreference>(value ?? 'system')
  return (
    <ThemeMenu
      {...props}
      value={current}
      onValueChange={(next) => {
        setCurrent(next)
        onValueChange?.(next)
      }}
    />
  )
}

const meta = {
  title: 'Layout/Theme Menu',
  component: ThemeMenu,
  parameters: {
    docs: {
      description: {
        component:
          'Round icon button (sun, moon or monitor) opening a Light / Dark / System radio menu. Without `value` it reads and updates the nearest `ThemeProvider` (via `useTheme()`); pass `value` + `onValueChange` to control it. Put it in the `TopBar` actions or on signed-out pages; in a settings form use a RadioGroup instead. The stories are controlled so they do not override the toolbar theme.',
      },
    },
  },
  args: {
    value: 'system',
    label: 'Theme',
    tooltip: true,
    align: 'end',
    modal: true,
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    value: { control: 'inline-radio', options: ['light', 'dark', 'system'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    labels: { control: 'object' },
    open: { control: false },
    contentClassName: { control: 'text' },
    onValueChange: { control: false },
    onOpenChange: { control: false },
  },
  render: (args) => <StatefulThemeMenu key={args.value} {...args} />,
} satisfies Meta<typeof ThemeMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Controlled menu; the trigger icon reflects the current preference. */
export const Default: Story = {}

/** One trigger per preference: sun (light), moon (dark), monitor (system). */
export const TriggerIcons: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <ThemeMenu {...args} value="light" />
      <ThemeMenu {...args} value="dark" />
      <ThemeMenu {...args} value="system" />
    </div>
  ),
}

/** Opened for visual review: mono label heading and radio items with icons. */
export const Open: Story = {
  args: { defaultOpen: true, modal: false, value: 'dark' },
  parameters: inFrame(240),
}

/** Translated heading and option names through `label` and `labels`. */
export const CustomLabels: Story = {
  args: {
    label: 'Thème',
    labels: { light: 'Clair', dark: 'Sombre', system: 'Système' },
    defaultOpen: true,
    modal: false,
  },
  parameters: inFrame(240),
}

/** Keyboard: Enter opens the menu on "Light", ArrowDown moves to "Dark", Enter picks it and updates the trigger. */
export const KeyboardSelection: Story = {
  args: { value: 'light' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Theme: Light' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    // Both parts carry their own `data-slot`, for tests and CSS.
    await expect(trigger).toHaveAttribute('data-slot', 'theme-menu-trigger')
    await expect(menu).toHaveAttribute('data-slot', 'theme-menu')
    await waitFor(() => expect(within(menu).getByRole('menuitemradio', { name: /Light/ })).toHaveFocus())
    await expect(within(menu).getByRole('menuitemradio', { name: /Light/ })).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(menu).getByRole('menuitemradio', { name: /Dark/ })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith('dark')
    // Attribute check: the page stays aria-hidden until the modal menu's exit animation ends.
    await waitFor(() => expect(trigger).toHaveAttribute('aria-label', 'Theme: Dark'))
  },
}

/** Shows what the nearest ThemeProvider holds, to watch the menu drive it. */
function ThemeReadout() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <span className="font-mono text-[12px] text-foreground-lighter">
      preference: {theme} · applied: {resolvedTheme}
    </span>
  )
}

const htmlIsDark = () => document.documentElement.classList.contains('dark')

/**
 * The uncontrolled menu inside its own `ThemeProvider` (persistence off), starting on the toolbar
 * theme. The provider re-themes <html>, so the toolbar theme is put back when the demo unmounts.
 */
function ThemeProviderDemo({ toolbarTheme, ...props }: ThemeMenuProps & { toolbarTheme: 'light' | 'dark' }) {
  React.useLayoutEffect(
    () => () => {
      const root = document.documentElement
      root.classList.toggle('dark', toolbarTheme === 'dark')
      // Storybook sets no inline color scheme of its own: drop the provider's.
      root.style.colorScheme = ''
    },
    [toolbarTheme],
  )
  return (
    <ThemeProvider storageKey={null} defaultTheme={toolbarTheme}>
      <div className="flex items-center gap-3">
        <ThemeMenu {...props} value={undefined} />
        <ThemeReadout />
      </div>
    </ThemeProvider>
  )
}

/**
 * The default, uncontrolled mode: without `value` the menu reads and updates the nearest
 * `ThemeProvider` (here with persistence off). Picking an option re-themes the whole page, as it
 * would in an app; the toolbar theme comes back when you leave the story or switch it in the toolbar.
 */
export const WithThemeProvider: Story = {
  args: { value: undefined },
  argTypes: { value: { control: false } },
  render: (args, { globals }) => {
    // The provider starts on the toolbar theme (the `theme` global of the themes addon) and is
    // remounted when the toolbar switches it, so the menu and the page never disagree.
    const toolbarTheme = globals.theme === 'dark' ? 'dark' : 'light'
    return <ThemeProviderDemo key={toolbarTheme} toolbarTheme={toolbarTheme} {...args} />
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /^Theme: / })
    const start = htmlIsDark() ? 'dark' : 'light'
    const other = start === 'dark' ? 'light' : 'dark'

    /** Opens the menu with the keyboard, jumps to a theme by typeahead (its first letter) and picks it. */
    const pick = async (theme: 'light' | 'dark') => {
      await expect(trigger).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      const menu = await screen.findByRole('menu')
      await userEvent.keyboard(theme.charAt(0))
      await waitFor(() => expect(within(menu).getByRole('menuitemradio', { name: new RegExp(theme, 'i') })).toHaveFocus())
      await userEvent.keyboard('{Enter}')
      await expect(args.onValueChange).toHaveBeenLastCalledWith(theme)
      // The provider applied it to the whole page.
      await waitFor(() => expect(htmlIsDark()).toBe(theme === 'dark'))
      await waitFor(() => expect(canvas.getByText(`preference: ${theme} · applied: ${theme}`)).toBeInTheDocument())
      // The menu is gone (exit animation over) and focus is back on the trigger.
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      await waitFor(() => expect(trigger).toHaveFocus())
    }

    await userEvent.tab()
    await pick(other)
    // Back to the starting theme, so the canvas ends on the toolbar theme.
    await pick(start)
  },
}
