import * as React from 'react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts'  

export interface IPieComponentData {
  color: string
  data: Array<{ name: string, value: number }>
  dataKey: string
  nameKey: string
  label: boolean
}

interface IPieComponentProps {
  dataSet: IPieComponentData[]
  dimensions?: { width: number, height: number }
  responsive?: { width: '100%', height: number } | { width: number, height: '100%' }
  showTable?: boolean
  showChart?: boolean
  showLabel?: boolean
}

import './PieChartComponent.scss'

export default class PieChartComponent extends React.PureComponent<IPieComponentProps, {}> {
  constructor(props : IPieComponentProps) {
    super(props)
  }

  public render() {
    return this.getPieChartObject(this.props.dataSet)
  }

  private getPieChartObject = (dataSet: IPieComponentProps['dataSet']) => {
    const pies = dataSet.map((data, key) => {
      return (
        <Pie 
          key={key} 
          data={data.data} 
          dataKey={data.dataKey} 
          nameKey={data.nameKey} 
          label={data.label} 
          fill={data.color}
          cx={'50%'}
          cy={'50%'}
        />
      )})

    const { responsive, dimensions } = this.props

    return responsive
      ? (
        <ResponsiveContainer minHeight={150} minWidth={150} width={responsive.width} height={responsive.height}>
          <PieChart>
            {pies}
          </PieChart>
        </ResponsiveContainer>
      )
      : dimensions && (
        <PieChart width={dimensions.width} height={dimensions.height}>
          {pies}
        </PieChart>
      )
  }
}