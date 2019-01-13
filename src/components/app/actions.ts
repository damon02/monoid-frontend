import { IAppProps } from "../../statics/types";

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