import getTime from './getTime.js'

export default function getCountdownPojos(to) {
  const now = getTime()
  if (to <= now) {
    return null
  } else {
    const diffSeconds = to - now
    const seconds = diffSeconds % 60

    const diffMin = Math.floor(diffSeconds / 60)
    const minutes = diffMin % 60

    const diffHours = Math.floor(diffMin / 60)
    const hours = diffHours % 24

    const days = (diffHours - hours) / 24

    return [
      {
        key: 'days',
        value: days,
      },
      {
        key: 'hours',
        value: hours,
      },
      {
        key: 'minutes',
        value: minutes,
      },
      {
        key: 'seconds',
        value: seconds,
      },
    ]
  }
}
