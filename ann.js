import { getLinearDomain } from './getLinearDomain';

interface TreeNode {
  value: number;
  children?: TreeNode[];
}

describe('getLinearDomain', () => {
  it('should return the correct min and max for a single node', () => {
    const treeData: TreeNode[] = [
      { value: 5 }
    ];
    const callback = (node: TreeNode) => node.value;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([5, 5]);
  });

  it('should return the correct min and max for a flat tree', () => {
    const treeData: TreeNode[] = [
      { value: 5 },
      { value: 10 },
      { value: -3 }
    ];
    const callback = (node: TreeNode) => node.value;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([-3, 10]);
  });

  it('should return the correct min and max for a nested tree', () => {
    const treeData: TreeNode[] = [
      {
        value: 5,
        children: [
          { value: 10 },
          { value: -3, children: [{ value: 7 }] }
        ]
      }
    ];
    const callback = (node: TreeNode) => node.value;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([-3, 10]);
  });

  it('should handle trees with null values returned by the callback', () => {
    const treeData: TreeNode[] = [
      {
        value: 5,
        children: [
          { value: 10 },
          { value: -3, children: [{ value: 7 }] }
        ]
      }
    ];
    const callback = (node: TreeNode) => node.value > 5 ? null : node.value;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([-3, 5]);
  });

  it('should return [0, 0] for an empty tree', () => {
    const treeData: TreeNode[] = [];
    const callback = (node: TreeNode) => node.value;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([0, 0]);
  });

  it('should return [0, 0] for a tree where all values are null', () => {
    const treeData: TreeNode[] = [
      { value: 1, children: [{ value: 2 }, { value: 3 }] }
    ];
    const callback = () => null;
    const result = getLinearDomain(treeData, callback);
    expect(result).toEqual([0, 0]);
  });
});
