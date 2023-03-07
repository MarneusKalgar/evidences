import * as React from 'react'
import { ComponentMeta } from '@storybook/react'
import { AppParamsProvider } from '@go/internal.native-communication'
import SettingsPage from '../SettingsPage'

export default {
  component: SettingsPage,
  decorators: [
    GetStory => (
      <AppParamsProvider appParams={{}}>
        <GetStory />
      </AppParamsProvider>
    ),
  ],
  parameters: {
    chromatic: {},
  },
  title: 'Pages/SettingsPage',
} as ComponentMeta<typeof SettingsPage>

const Template: typeof SettingsPage = () => <SettingsPage />

export const Example = Template.bind({})
