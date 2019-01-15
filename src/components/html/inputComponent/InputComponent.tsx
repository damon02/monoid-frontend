import * as React from 'react'
import './InputComponent.scss'

interface IInputComponentProps {
  label: string
  type: 'date' | 'email' | 'number' | 'password' | 'text' | 'url'
  value: string | number
  onChange: (value : string) => void
  isValid?: boolean
  onFocus?: (x: boolean) => void
  touched?: boolean
  autoComplete?: 'on' | 'off'
  faIcon?: string
  onEnter? : () => void
  disabled?: boolean
  numberLimits?: [number, number]
}

const InputComponent = (props : IInputComponentProps) => (
  <div className={`inputComponent${props.isValid !== undefined ? props.isValid === false ? ' invalid' : ' valid' : ''}${props.faIcon ? ' icon-padding' : ''}`}>
    <label className={`label ${props.value ? 'extended' : 'empty'}`}>{props.label}</label>
    {props.faIcon ? <i className={`abs-fa ${props.faIcon}`}/> : null}
    <input 
      className={`field${props.touched ? '' : ' untouched'}${props.faIcon ? ' icon-padding' : ''}`}
      type={props.type}
      value={props.value}
      onChange={(e) => !props.onChange ? ({}) : props.onChange(e.target.value)}
      onFocus={() => !props.onFocus ? ({}) : props.onFocus(true)}
      autoComplete={props.autoComplete || 'on'}
      onKeyPress={(e) => props.onEnter && e.key === 'Enter' ? props.onEnter() : ({})}
      disabled={props.disabled}
      min={props.numberLimits ? props.numberLimits[0] : undefined}
      max={props.numberLimits ? props.numberLimits[1] : undefined}
    />
  </div>
)

export default InputComponent