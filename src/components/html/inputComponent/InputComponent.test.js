import React from 'react'
import ReactDOM from 'react-dom'
import InputComponent from './InputComponent'
import Renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <InputComponent />, 
    div
  )
})

it('renders correctly', () => {
  const tree = Renderer
    .create(<InputComponent label={'test'} type={'text'} value={'hello world'} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})

it('changes input and then renders correctly', () => {
  const input = shallow(<InputComponent label={'test'} type={'text'} value={''} />)

  expect(input.containsMatchingElement(<label>test</label>))
  expect(input.containsMatchingElement(<input></input>))

  input.setProps({ value: 'Hello world!' })

  expect(input.containsMatchingElement(<input>Hello world!</input>))
})