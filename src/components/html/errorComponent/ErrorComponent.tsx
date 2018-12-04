import * as React from 'react'

interface IErrorComponentProps {
  message: string
  faIcon?: string
  onClick?: () => void
  align?: 'left' | 'center' | 'right'
}

const ErrorComponent : React.FunctionComponent<IErrorComponentProps> = (props) => (
  props.message
    ? (
      <div 
        className={`error ${props.align || 'center'}${props.onClick ? ' clickable' : ''}`}
        onClick={() => props.onClick ? props.onClick() : ({})}
      >
        {props.faIcon ? <i className={props.faIcon}/> : null}
        <div className="message">
          {props.message}
        </div>
      </div>
      )
    : null
)

export default ErrorComponent