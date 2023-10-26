import { useEffect, useRef, useState, useCallback } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import data from './datasets/miserables.json';
import { forceLink } from 'd3-force';
import { forceX, forceY } from 'd3-force';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



export const Map = () => {
    const fgRef = useRef();
    // const graphData = genRandomTree();
    const [graphData, setGraphData] = useState(data);


    //add node every second
    // useEffect(() => {
    //     setInterval(() => {
    //add node on click
    const handleBackgroundClick = () => {
        //change parameters
        const id = "newPoint!";
        const group = 8;
        const x = 0;
        const y = 0;
        const z = 0;

        const newNodes = [...graphData.nodes, { id, group, x, y, z }];
        const newLinks = [...graphData.links];

        if (newNodes.length > 1) {
            const source = id;
            const target = "Myriel" //change
            const value = 6; //change
            newLinks.push({ source, target, value });
        }
        setGraphData({ nodes: newNodes, links: newLinks });
    };
    //     }, 1000);
    // }, []);

    //remove node on right click
    const handleNodeRightClick = useCallback(node => {
        const newLinks = graphData.links.filter(l => l.source !== node && l.target !== node);
        const newNodes = graphData.nodes.filter(n => n.id !== node.id);
        setGraphData({ nodes: newNodes, links: newLinks });
    }, [graphData, setGraphData]);

    const extraRenderers = [new CSS2DRenderer()];

    const linkForce = forceLink()
        .id(link => link.id)
        .distance(link => link.distance || 10)
        .strength(link => link.strength || 0.01);


    const xForce = forceX(node => node.x || 0).strength(0.5);
    const yForce = forceY(node => node.y || 0).strength(0.5);
    // const zForce = forceZ(node => node.z).strength(0.1);

    useEffect(() => {
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 0.4;
        bloomPass.radius = 1;
        bloomPass.threshold = 0;
        fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);

    return (

        <ForceGraph3D
            extraRenderers={extraRenderers}
            ref={fgRef}
            graphData={graphData}
            backgroundColor="#000003"
            forceEngine='d3'
            // nodeLabel="id"
            d3Force={(forceName, forceFn) => {
                if (forceName === 'x') forceFn(xForce);
                if (forceName === 'y') forceFn(yForce);
                if (forceName === 'link') forceFn(linkForce);
            }}

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
            onBackgroundClick={handleBackgroundClick}
            onNodeRightClick={handleNodeRightClick}
            onNodeDragEnd={node => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            }}
        />

    );
}



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