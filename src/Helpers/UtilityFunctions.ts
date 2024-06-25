import { Edge, Node } from "reactflow";
import { Block } from "./Block";

export const returnPositions = (i: number) => {
  return { y: 40, x: i * 200 + 40 };
};

const nameToId = (name: string): string => {
  return name.replace(/\s+/g, "_").toLowerCase();
};

export const blocksToNodes = (
  blocks: Block[],
  layoutDirection: string
): Node[] => {
  const nodes: Node[] = [];
  const groups: Set<string> = new Set();

  blocks.forEach((block, i) => {
    // if block has a group, create a new group node
    if (block.group) {
      if (!groups.has(block.group)) {
        groups.add(block.group); // if group doesn't exist in the set, add it

        // create a new group node
        nodes.push({
          id: nameToId(block.group),
          position: returnPositions(i),
          type: "customNode",
          data: {
            label: block.group,
            blockType: block.type,
            layoutDirection: layoutDirection,
          },
        });
      }

      nodes.push({
        id: block.id.toString(),
        position: returnPositions(i),
        type: "customNode",
        parentId: nameToId(block.group),
        extent: "parent",
        data: {
          label: block.name,
          blockType: block.type,
          handleCount: block.outputs.length,
          nodeId: block.id,
          layoutDirection: layoutDirection,
        },
      });
    } else {
      nodes.push({
        id: block.id.toString(),
        position: returnPositions(i),
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

  console.info(nodes);

  return nodes;
};

export const blocksToEdges = (blocks: Block[]): Edge[] => {
  const edges: Edge[] = [];

  blocks.forEach((block) => {
    let sourceHandleIdx = 0;
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
  });

  console.log(edges);

  return edges;
};
