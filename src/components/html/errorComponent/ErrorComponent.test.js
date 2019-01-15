import React from 'react'
import ReactDOM from 'react-dom'
import ErrorComponent from './ErrorComponent'
import Renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <ErrorComponent />, 
      div
    )
  })
  
  it('renders correctly', () => {
    const tree = Renderer
      .create(<ErrorComponent message={'blahblah'} />)
      .toJSON()
  
    expect(tree).toMatchSnapshot()
  })
  
  it('changes input and then renders correctly', () => {
    const input = shallow(<ErrorComponent message={'bloehbloeh'} />)
  
    expect(input.containsMatchingElement(<div className="message">bloehbloeh</div>))  
    input.setProps({ value: 'This is a test' })
  
    expect(input.containsMatchingElement(<div className="message">This is a test</div>))
  })