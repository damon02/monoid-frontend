import * as React from 'react'
import './InputComponent.scss'

interface IInputComponentProps {
  label: string
  type: 'date' | 'email' | 'number' | 'password' | 'text' | 'url'
  value: string
  onChange: (value : string) => void
  isValid?: boolean
  onFocus?: (x: boolean) => void
  touched?: boolean
  autoComplete?: 'on' | 'off'
}


const InputComponent = (props : IInputComponentProps) => (
  <div className={`inputComponent ${props.isValid !== undefined ? props.isValid === false ? ' invalid' : ' valid' : ''}`}>
    <label className={`label ${props.value ? 'extended' : 'empty'}`}>{props.label}</label>
    <input 
      className={`field${props.touched ? '' : ' untouched'}`}
      type={props.type}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      onFocus={() => !props.onFocus ? ({}) : props.onFocus(true)}
      autoComplete={props.autoComplete || 'on'}
    />
  </div>
)

export default InputComponent