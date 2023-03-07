import { render } from '@testing-library/vue'
import { jest } from '@jest/globals'
import Snackbar from '../snackbar.vue'

jest.useFakeTimers()

it('renders when not showing', async () => {
  render(Snackbar, {
    props: {
      show: false,
    },
  })
})

it('renders when showing', async () => {
  render(Snackbar, {
    props: {
      show: true,
    },
  })
})

it('renders when timeout supplied', async () => {
  render(Snackbar, {
    props: {
      show: true,
      timeout: 99,
    },
  })
})

it('renders when onClose supplied', async () => {
  render(Snackbar, {
    props: {
      show: true,
      timeout: 99,
      onClose: jest.fn(),
    },
  })
})

it('calls onClose when timing out', async () => {
  const mockClose = jest.fn()

  render(Snackbar, {
    props: {
      show: true,
      timeout: 1,
      onClose: mockClose,
    },
  })
  jest.runAllTimers()
  expect(mockClose).toHaveBeenCalledTimes(1)
})

it("doesn't call onClose if timeout set to 0", async () => {
  const mockClose = jest.fn()

  render(Snackbar, {
    props: {
      show: true,
      timeout: 0,
      onClose: mockClose,
    },
  })
  jest.runAllTimers()
  expect(mockClose).not.toBeCalled()
})

it('should default to snackbar with no icon when kind is not passed in', async () => {
  const { queryByTestId } = render(Snackbar, {
    props: {
      show: true,
    },
  })

  expect(queryByTestId('snackbar-alert-icon')).toBeNull()
  expect(queryByTestId('snackbar-success-icon')).toBeNull()
})

it('should be alert kind when told to be', async () => {
  const { getByTestId, queryByTestId } = render(Snackbar, {
    props: {
      show: true,
      kind: 'alert',
    },
  })

  expect(getByTestId('snackbar-alert-icon')).toBeTruthy()
  expect(queryByTestId('snackbar-success-icon')).toBeNull()
})

it('should be success kind when told to be', async () => {
  const { getByTestId, queryByTestId } = render(Snackbar, {
    props: {
      show: true,
      kind: 'success',
    },
  })

  expect(getByTestId('snackbar-success-icon')).toBeTruthy()
  expect(queryByTestId('snackbar-alert-icon')).toBeNull()
})
