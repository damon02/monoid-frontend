import { IAppProps } from '../../statics/types'

export function setTheme(theme : string) {
  return {
    type: 'SET_THEME',
    theme
  }
}

export function setSettings(settings: IAppProps['settings']) {
  return {
    type: 'SET_SETTINGS',
    settings
  }
}

export function setRules(rules: IAppProps['rules']) {
  return {
    type: 'SET_RULES',
    rules
  }
}

export function setPackets(packets: IAppProps['packets']) {
  return {
    type: 'SET_PACKETS',
    packets
  }
}

export function setTimes(times: IAppProps['times']) {
  return {
    type: 'SET_DATES',
    times
  }
}