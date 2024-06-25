import { Block, BlockType } from "./Block";

class Graph {
  private blocks: Block[] = [];

  constructor(numInputs: number, numOutputs: number, numFilters: number) {
    this.initializeGraph(numInputs, numOutputs, numFilters);
  }

  private initializeGraph(
    numInputs: number,
    numOutputs: number,
    numFilters: number
  ) {
    let idCounter = 0;

    // Create input blocks
    for (let i = 0; i < numInputs; i++) {
      this.blocks.push({
        id: idCounter.toString(),
        name: `Input${i}`,
        type: BlockType.INPUT,
        outputs: [],
      });
      idCounter++;
    }

    // Create filter blocks
    for (let i = 0; i < numFilters; i++) {
      this.blocks.push({
        id: idCounter.toString(),
        name: `Filter${i}`,
        type: BlockType.FILTER,
        outputs: [],
      });
      idCounter++;
    }

    // Create output blocks
    for (let i = 0; i < numOutputs; i++) {
      this.blocks.push({
        id: idCounter.toString(),
        name: `Output${i}`,
        type: BlockType.OUTPUT,
        outputs: [],
      });
      idCounter++;
    }

    this.connectBlocks();

    // Ensure paths from inputs to outputs
    for (const input of this.blocks.filter(
      (block) => block.type === BlockType.INPUT
    )) {
      for (const output of this.blocks.filter(
        (block) => block.type === BlockType.OUTPUT
      )) {
        if (!this.ensurePath(input.id, output.id)) {
          // If a path does not exist, create one
          this.ensurePath(input.id, output.id);
        }
      }
    }
  }

  private connectBlocks() {
    const inputs = this.blocks.filter(
      (block) => block.type === BlockType.INPUT
    );
    const outputs = this.blocks.filter(
      (block) => block.type === BlockType.OUTPUT
    );
    const filters = this.blocks.filter(
      (block) => block.type === BlockType.FILTER
    );

    const allBlocks = [...inputs, ...filters];

    for (const filter of filters) {
      // Connect to a random previous block (input or filter)
      const previousBlocks = allBlocks.filter((block) => block.id < filter.id);
      if (previousBlocks.length > 0) {
        const inputBlock =
          previousBlocks[Math.floor(Math.random() * previousBlocks.length)];
        if (!this.wouldCreateCycle(inputBlock.id, filter.id)) {
          inputBlock.outputs.push({
            targets: [filter.id],
            type: this.getRandomLinkType(),
          });
        }
      }
    }

    // Ensure all filters have outputs leading to an output block
    for (const filter of filters) {
      if (filter.outputs.length === 0) {
        const nextBlocks = outputs.filter((block) => block.id > filter.id);
        if (nextBlocks.length > 0) {
          const outputBlock =
            nextBlocks[Math.floor(Math.random() * nextBlocks.length)];
          if (!this.wouldCreateCycle(filter.id, outputBlock.id)) {
            const newPath = [outputBlock.id];
            filter.outputs.push({
              targets: newPath,
              type: this.getRandomLinkType(),
            });
          }
        }
      }
    }
  }

  private ensurePath(
    startId: string,
    endId: string,
    visited: Set<string> = new Set()
  ): boolean {
    if (startId === endId) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);

    const block = this.blocks.find((b) => b.id === startId);
    if (!block) return false;

    for (const output of block.outputs) {
      if (this.ensurePath(output.targets[0], endId, visited)) {
        return true;
      }
    }

    if (block.type !== BlockType.OUTPUT) {
      const possibleOutputs = this.blocks.filter(
        (b) =>
          b.type === BlockType.FILTER ||
          (b.type === BlockType.OUTPUT && b.id === endId)
      );
      for (const nextBlock of possibleOutputs) {
        if (
          !visited.has(nextBlock.id) &&
          !this.wouldCreateCycle(block.id, nextBlock.id)
        ) {
          block.outputs.push({
            targets: [nextBlock.id],
            type: this.getRandomLinkType(),
          });
          if (this.ensurePath(nextBlock.id, endId, visited)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private wouldCreateCycle(
    startId: string,
    endId: string,
    visited: Set<string> = new Set()
  ): boolean {
    if (startId === endId) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);

    const block = this.blocks.find((b) => b.id === startId);
    if (!block) return false;

    for (const output of block.outputs) {
      if (this.wouldCreateCycle(output.targets[0], endId, visited)) {
        return true;
      }
    }

    return false;
  }

  private getRandomLinkType(): any {
    const types = ["file", "text", "audio", "video"];
    return types[Math.floor(Math.random() * types.length)];
  }

  public getBlocks() {
    return this.blocks;
  }
}

export const initializeGraph = (
  inputBlocks: number,
  outputBlocks: number,
  filterBlocks: number
) => {
  const graph = new Graph(inputBlocks, outputBlocks, filterBlocks);
  return graph.getBlocks();
};
