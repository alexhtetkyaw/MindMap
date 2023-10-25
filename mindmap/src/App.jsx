import { useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import data from './datasets/miserables.json';


function App() {
  const fgRef = useRef();
  // const graphData = genRandomTree();



  const extraRenderers = [new CSS2DRenderer()];


  return (

    <ForceGraph3D
      extraRenderers={extraRenderers}
      ref={fgRef}
      graphData={data}
      nodeAutoColorBy="group"
      nodeThreeObject={node => {
        const label = document.createElement('div');
        label.textContent = `${node.id}`;
        label.className = 'node-label';
        label.style.color = node.color;
        let text = new CSS2DObject(label);
        return text;
      }}
      nodeThreeObjectExtend={true}
    />

  );
}


export default App;



// function genRandomTree(N = 300, reverse = false) {
//   return {
//     nodes: [...Array(N).keys()].map(i => ({ id: i })),
//     links: [...Array(N).keys()]
//       .filter(id => id)
//       .map(id => ({
//         [reverse ? 'target' : 'source']: id,
//         [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
//       }))
//   };
// }

