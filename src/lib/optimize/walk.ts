import type { Node } from "../schema/types";
export function eachNode(root: Node, fn: (n: Node, parents: Node[]) => void, parents: Node[] = []) {
  fn(root, parents);
  root.children?.forEach((c) => eachNode(c, fn, [...parents, root]));
}
export const isText = (n: Node) => ["Heading", "Text", "RichText", "Quote", "Label", "Stat", "ClientList", "ContactDetails", "TeamList", "NumberList", "ProcessSteps"].includes(n.type);
export const isToken = (v?: string) => !v || v.startsWith("token:");
