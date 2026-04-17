import { SVGCanvas, BackgroundLayer, GameObjectsLayer, FXLayer, UILayer } from './svg'
import './index.css'

function App() {
  return (
    <div className="app-container">
      <SVGCanvas width={800} height={600}>
        <BackgroundLayer>
          <rect x={0} y={0} width={800} height={600} fill="#1a1a2e" />
          <text x={400} y={300} textAnchor="middle" fill="#4a4a6a" fontSize={24}>
            N.P.Nemo
          </text>
        </BackgroundLayer>
        
        <GameObjectsLayer>
        </GameObjectsLayer>
        
        <FXLayer>
        </FXLayer>
        
        <UILayer>
          <text x={400} y={550} textAnchor="middle" fill="#888" fontSize={14}>
            Press any key to start
          </text>
        </UILayer>
      </SVGCanvas>
    </div>
  )
}

export default App
