import './Legend.css'

const Legend = ({ color, title, percentage }) => {
  return (
    <div className="legend">
      <div className="colorbox" style={{ backgroundColor: color }}></div>
      <p className="legendlabel">{title}</p>
      <p className="legendlabel" style={{ color: color }}>
        ({percentage?.toFixed(2)}%)
      </p>
    </div>
  )
}

export default Legend
