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
    const [selectedNodes, setSelectedNodes] = useState(new Set());

    //add node every second
    // useEffect(() => {
    //     setInterval(() => {
    //add node on click
    const handleBackgroundClick = () => {
        //change parameters
        const id = "newPoint!";
        const x = 0;
        const y = 0;
        const z = 0;

        let group;
        const selectedGroups = Array.from(selectedNodes, node => node.group);
        const allSameGroup = selectedGroups.every((val, i, arr) => val === arr[0]);

        if (allSameGroup && selectedGroups.length > 0) {
            group = selectedGroups[0];
        } else {
            group = Math.max(...graphData.nodes.map(node => node.group)) + 1;
        }

        const newNodes = [...graphData.nodes, { id, group, x, y, z }];
        const newLinks = [...graphData.links];

        if (newNodes.length > 1) {
            selectedNodes.forEach(selectedNode => {
                const source = id;
                const target = selectedNode.id;
                const value = 6; //change
                newLinks.push({ source, target, value });
            });
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

    //select nodes
    const handleNodeClick = (node, event) => {
        setSelectedNodes(prevSelectedNodes => {
            const newSelectedNodes = new Set(prevSelectedNodes);
            if (event.ctrlKey || event.shiftKey || event.altKey) {
                // multi-selection
                newSelectedNodes.has(node) ? newSelectedNodes.delete(node) : newSelectedNodes.add(node);
            } else {
                // single-selection
                const untoggle = newSelectedNodes.has(node) && newSelectedNodes.size === 1;
                newSelectedNodes.clear();
                !untoggle && newSelectedNodes.add(node);
            }

            console.log(newSelectedNodes)

            return newSelectedNodes;
        });
    };

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
            nodeVal={node => selectedNodes.has(node) ? 10 : 1}
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
            onNodeClick={handleNodeClick}
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