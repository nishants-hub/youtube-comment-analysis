import { PieChart } from 'react-minimal-pie-chart'
import React from 'react'

const GradientPieChart = ({ data }) => {
  // Define gradients using SVG <defs> element
  const gradients = (
    <defs>
      <linearGradient id="gradient1" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="green" />
        <stop offset="100%" stopColor="yellow" />
      </linearGradient>

      <linearGradient id="gradient2" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="blue" />
        <stop offset="100%" stopColor="purple" />
      </linearGradient>
      <linearGradient id="gradient3" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="red" />
        <stop offset="100%" stopColor="orange" />
      </linearGradient>
    </defs>
  )

  return (
    <div>
      <svg>
        {gradients}
        <PieChart
          data={data}
          label={({ dataEntry }) => dataEntry.value}
          labelStyle={{
            fontSize: '5px',
            fontFamily: 'sans-serif',
            fill: '#fff',
          }}
          radius={42}
          lineWidth={50}
          paddingAngle={5}
          startAngle={270}
        />
      </svg>
    </div>
  )
}

export default GradientPieChart
