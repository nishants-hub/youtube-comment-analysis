import { PieChart } from 'react-minimal-pie-chart'
import React from 'react'

const GradientPieChart = ({ data }) => {
  // Define gradients using SVG <defs> element
  const gradients = (
    <defs>
      <linearGradient id="gradient1" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#82ca26" />
        <stop offset="100%" stopColor="#82ca26" />
      </linearGradient>

      <linearGradient id="gradient2" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#1fa5ff" />
        <stop offset="100%" stopColor="#1fa5ff" />
      </linearGradient>
      <linearGradient id="gradient3" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#d55438" />
        <stop offset="100%" stopColor="#d55438" />
      </linearGradient>
    </defs>
  )

  return (
    <div style={{ height: '200px', width: '200px' }}>
      <svg
        style={{
          height: '200px',
          width: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {gradients}
        <PieChart
          data={data}
          // label={({ dataEntry }) => dataEntry.value}
          // labelStyle={{
          //   fontSize: '5px',
          //   fontFamily: 'sans-serif',
          //   fill: '#fff',
          // }}
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
