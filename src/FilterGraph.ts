export interface Block {
  id: number;
  name: string;
  in_ids: number[];
  out_ids: number[];
  type: BlockType;
}

export enum BlockType {
  FILTER = "filter",
  INPUT = "input",
  OUTPUT = "output",
}

class FilterGraph {
  private blocks: Map<number, Block>;

  constructor(numFilters: number) {
    console.log("FilterGraph constructor called with numFilters:", numFilters);
    this.blocks = new Map();
    this.initializeBlocks(numFilters);
    this.initializeConnections();
  }

  // initialize all blocks without connections
  private initializeBlocks(numFilters: number): void {
    console.log("initializeBlocks called with numFilters:", numFilters);
    this.createBlock(0, "Input", [], [1], BlockType.INPUT);
    this.createBlock(numFilters + 1, "Output", [], [], BlockType.OUTPUT);
    for (let i = 1; i <= numFilters; i++) {
      this.createBlock(i, `Filter ${i}`, [], [], BlockType.FILTER);
    }
  }

  private initializeConnections() {
    // Initialize connections
    const inputBlock = this.getBlock(0);
    const outputBlock = this.getBlock(this.blocks.size - 1);

    // Constraint 3: The input file should have at least one output
    if (inputBlock.out_ids.length === 0) {
      inputBlock.out_ids.push(1);
      this.getBlock(1).in_ids.push(0);
    }

    // Constraint 4: The output file should have at least one input
    if (outputBlock.in_ids.length === 0) {
      let idx = this.blocks.size - 2;
      outputBlock.in_ids.push(idx);
      this.getBlock(idx).out_ids.push(this.blocks.size - 1);
    }

    // Iterate through the filter blocks and create connections
    for (let i = 1; i < this.blocks.size - 1; i++) {
      const filterBlock = this.getBlock(i);
      let outIds: number[] = [];

      do {
        outIds = this.getUniqueRandomIds(Math.floor(Math.random() * 2) + 1, [
          0,
          filterBlock.id,
          ...filterBlock.in_ids,
          ...filterBlock.out_ids,
        ]);
      } while (this.hasCycle(i));

      // Add the connections
      for (const outId of outIds) {
        this.getBlock(outId).in_ids.push(i);
        filterBlock.out_ids.push(outId);
      }

      // Constraint 5: A path should reach the output file
      if (!this.hasPathToOutput(0)) {
        console.log("No path found from input to output");
        this.resetConnections();
        this.initializeConnections();
      }
    }
  }

  // reset all connections
  private resetConnections(): void {
    for (const block of this.blocks.values()) {
      block.in_ids = [];
      block.out_ids = [];
    }
  }

  private hasCycle(startId: number): boolean {
    const visited: Set<number> = new Set();
    const stack: number[] = [startId];
    const visiting: Set<number> = new Set();

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (visiting.has(currentId)) {
        return true;
      }
      if (visited.has(currentId)) {
        continue;
      }
      visited.add(currentId);
      visiting.add(currentId);

      const block = this.getBlock(currentId);
      for (const outId of block.out_ids) {
        stack.push(outId);
      }
      visiting.delete(currentId);
    }

    return false;
  }

  private hasPathToOutput(startId: number): boolean {
    const visited: Set<number> = new Set();
    const queue: number[] = [startId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (currentId === this.blocks.size - 1) {
        return true;
      }
      if (visited.has(currentId)) {
        continue;
      }
      visited.add(currentId);

      const block = this.getBlock(currentId);
      for (const outId of block.out_ids) {
        queue.push(outId);
      }
    }

    return false;
  }

  private createBlock(
    id: number,
    name: string,
    inIds: number[],
    outIds: number[],
    type: BlockType,
  ): void {
    this.blocks.set(id, { id, name, in_ids: inIds, out_ids: outIds, type });
  }

  private getUniqueRandomIds(count: number, exclude: number[] = []): number[] {
    const available = Array.from(
      { length: this.blocks.size },
      (_, i) => i,
    ).filter((id) => !exclude.includes(id));

    if (available.length === 0) {
      return [];
    }

    if (available.length < count) {
      return available;
    }

    const ids: number[] = [];
    while (ids.length < count) {
      const randomIndex = Math.floor(Math.random() * available.length);
      ids.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return ids;
  }

  public getBlock(id: number): Block {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block with ID ${id} not found`);
    }
    return block;
  }

  public getBlockMap(): Map<number, Block> {
    return this.blocks;
  }
}

export default function initializeGraph(num_of_filters: number) {
  const filterGraph = new FilterGraph(num_of_filters);
  return filterGraph.getBlockMap();
}
