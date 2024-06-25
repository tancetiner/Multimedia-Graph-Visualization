export interface Block {
  id: string;
  name: string;
  outputs: Output[];
  type: BlockType;
  group?: string;
}

export interface Output {
  targets: string[];
  type: LinkType;
}

export enum LinkType {
  audio = "audio",
  video = "video",
  text = "text",
  file = "file",
}

export enum BlockType {
  FILTER = "filter",
  INPUT = "input",
  OUTPUT = "output",
  GROUP = "group",
}
