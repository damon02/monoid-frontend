import * as React from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'  
import { IGraphComponentData } from '../../../../statics/types'

interface IPieComponentProps {
  dataSet: IGraphComponentData[]
  dimensions?: { width: number, height: number }
  responsive?: { width: '100%', height: number } | { width: number, height: '100%' }
  showLabel?: boolean
}

export default class PieChartComponent extends React.PureComponent<IPieComponentProps, {}> {
  constructor(props : IPieComponentProps) {
    super(props)
  }

  public render() {
    const { dataSet, responsive, dimensions } = this.props
    const pies = dataSet.map((data, key) => {
      return (
        <Pie 
          key={key} 
          data={data.data} 
          dataKey={data.dataKey} 
          nameKey={data.nameKey} 
          label={true} 
          labelLine={true}
          fill={data.color}
          cx={'50%'}
          cy={'50%'}
        />
      )}
    )

    return responsive ? (
        <ResponsiveContainer minHeight={250} minWidth={250} width={responsive.width} height={responsive.height}>
          <PieChart>
            {pies}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )
    : dimensions && (
      <PieChart width={dimensions.width} height={dimensions.height}>
        {pies}
        <Tooltip />
      </PieChart>
    )
  }
}