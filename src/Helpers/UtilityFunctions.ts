import { Edge, Node } from "reactflow";
import { Block } from "./Block";

export const returnPositions = (i: number) => {
  return { y: 40, x: i * 200 + 40 };
};

const nameToId = (name: string): string => {
  return name.replace(/\s+/g, "_").toLowerCase();
};

interface Handle {
  nodeId: string;
  nodeName: string;
  outputs: string[];
  type: string;
}

interface GroupInfo {
  name: string;
  id: string;
  handles: Handle[];
  numberOfFilters: number;
}

export const blocksToNodesAndEdges = (
  blocks: Block[],
  layoutDirection: string,
  grouping: boolean
): { nodes: Node[]; edges: Edge[] } => {
  // NODES
  const nodes: Node[] = [];
  const groups: { [key: string]: GroupInfo } = {};
  let nodeCount = 0;

  blocks.forEach((block) => {
    // if grouping is enabled and the block has a group field, add the block to the group
    if (grouping && block.group) {
      const groupId: string = nameToId(block.group);
      if (groups[groupId] === undefined) {
        // if the group doesn't exist, create it
        groups[groupId] = {
          handles: [],
          name: block.group,
          id: nameToId(block.group),
          numberOfFilters: 0,
        } as GroupInfo;
      }

      // for each output of the block, add a handle to the group
      block.outputs.forEach((output) => {
        groups[groupId].handles.push({
          nodeId: block.id,
          nodeName: block.name,
          outputs: output.targets.map((target) => target.toString()),
          type: output.type,
        });
      });

      // increment the number of filters in the group
      groups[groupId].numberOfFilters++;
    } else {
      // if the block doesn't have a group field, add it as a node
      nodes.push({
        id: block.id.toString(),
        position: returnPositions(nodeCount++),
        type: "customNode",
        data: {
          label: block.name,
          blockType: block.type,
          handleCount: block.outputs.length,
          nodeId: block.id,
          layoutDirection: layoutDirection,
        },
      });
    }
  });

  // if grouping is enabled, add group nodes to the nodes array
  if (grouping) {
    for (const groupId in groups) {
      const group = groups[groupId];
      nodes.push({
        id: groupId,
        position: returnPositions(nodeCount++),
        type: "groupNode",
        data: {
          label: group.name,
          handleCount: group.handles.length,
          nodeId: groupId,
          layoutDirection: layoutDirection,
          numberOfFilters: group.numberOfFilters,
        },
      });
    }
  }

  console.info(nodes);

  // EDGES
  const edges: Edge[] = [];

  blocks.forEach((block) => {
    let sourceHandleIdx = 0;
    if (!(grouping && block.group)) {
      block.outputs.forEach((output) => {
        output.targets.forEach((target) => {
          // get the block that has the target in their id field
          const targetBlock = blocks.filter((b) => b.id === target)[0];

          // if the target block has a group field, set the targetId to the group id
          if (targetBlock.group) {
            target = nameToId(targetBlock.group);
          }

          // if the block has a group field, set the sourceId to the group id
          let sourceId = block.id.toString();
          let sourceHandle = `handle-${sourceHandleIdx.toString()}`;
          if (block.group) {
            sourceId = nameToId(block.group);
            sourceHandle = "handle-0";
          }

          const edgeId = `e-${sourceHandleIdx}-${nameToId(block.id)}-${nameToId(
            target
          )}`;

          edges.push({
            id: edgeId,
            type: "customEdge",
            source: sourceId,
            sourceHandle: sourceHandle,
            target: target,
            data: {
              linkType: output.type,
            },
          });
        });
        sourceHandleIdx++;
      });
    }
  });

  // iterate over the nodes and add the edges of the group nodes
  if (grouping) {
    nodes.forEach((node) => {
      if (node.type === "groupNode") {
        const group = groups[node.id];
        let sourceHandleIdx = 0;
        group.handles.forEach((handle) => {
          handle.outputs.forEach((output) => {
            let target = output;
            const targetBlock = blocks.filter((b) => b.id === target)[0];

            if (targetBlock.group) {
              target = nameToId(targetBlock.group);
            }

            const sourceId = node.id;
            const sourceHandle = `handle-${sourceHandleIdx.toString()}`;

            const edgeId = `e-${sourceHandleIdx}-${node.id}-${target}`;

            edges.push({
              id: edgeId,
              type: "customEdge",
              source: sourceId,
              sourceHandle: sourceHandle,
              target: target,
              data: {
                linkType: handle.type,
              },
            });
          });
          sourceHandleIdx++;
        });
      }
    });
  }

  console.log(edges);

  return { nodes, edges };
};
