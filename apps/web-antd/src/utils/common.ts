import { message } from 'ant-design-vue';

import { $t } from '#/locales';

type ToastType = 'error' | 'info' | 'loading' | 'success' | 'warning';

interface ToastConfig {
  type?: ToastType;
  content?: string;
  duration?: number;
  onClose?: () => void;
}

// 提示message
export const showToast = (config: ToastConfig) => {
  const content = config.content;
  const duration = config.duration || 3;
  const onClose = config.onClose;
  switch (config.type) {
    case 'error': {
      message.error(content, duration, onClose);
      break;
    }
    case 'loading': {
      message.loading(content, duration, onClose);
      break;
    }
    case 'success': {
      message.success(content, duration, onClose);
      break;
    }
    case 'warning': {
      message.warning(content, duration, onClose);
      break;
    }
    default: {
      message.info(content, duration, onClose);
      break;
    }
  }
};

// 定义默认配置接口
interface TreeMapOptions {
  idField?: string;
  parentField?: string;
  parentValue?: any;
  childrenField?: string;
}

// 将平面数组转成树形结构
export const handleTreeMap = (data: any[], options: TreeMapOptions = {}) => {
  const {
    idField = 'id',
    parentField = 'parent_id',
    parentValue = 0,
    childrenField = 'children',
  } = options;
  const map = new Map();
  const tree: any[] = [];
  data.forEach((item) => {
    map.set(item[idField], { ...item, [childrenField]: [] });
  });
  data.forEach((item) => {
    if (item[parentField] === parentValue) {
      tree.push(map.get(item[idField]));
    } else {
      const parent = map.get(item[parentField]);
      if (parent) {
        parent[childrenField].push(map.get(item[idField]));
      }
    }
  });
  return tree;
};

// 遍历树节点过滤值
export const handleTreeFilte = (
  treeList: any[],
  filter: any[],
  relation: string = 'and',
) => {
  const result: any[] = [];
  const traverseNode = (node: { [x: string]: any; children: any[] }) => {
    let valHas = false;
    // 过滤条件需要全部满足才成立
    if (relation === 'and') {
      valHas = filter.every((item) => {
        const propVal = item.prop.split('.'); // 是否有二级字段
        const nodeVal =
          propVal.length > 1 ? node[propVal[0]][propVal[1]] : node[propVal[0]];
        return item.value
          ? nodeVal.includes(item.value) || $t(nodeVal).includes(item.value)
          : true;
      });
    }
    // 过滤条件只要满足一个就成立
    if (relation === 'or') {
      valHas = filter.some((item) => {
        const propVal = item.prop.split('.'); // 是否有多级字段
        const nodeVal =
          propVal.length > 1 ? node[propVal[0]][propVal[1]] : node[propVal[0]];
        return item.value
          ? nodeVal.includes(item.value) || $t(nodeVal).includes(item.value)
          : false;
      });
    }
    if (valHas) return node;
    if (Array.isArray(node.children) && node.children.length > 0) {
      const newChildNode: { children: any[] }[] = [];
      node.children.forEach((child: any) => {
        const childNode = traverseNode(child);
        if (childNode) newChildNode.push(childNode);
      });
      if (newChildNode.length > 0) return { ...node, children: newChildNode };
    }
  };
  treeList.forEach((rootNode: any) => {
    const newNode = traverseNode(rootNode);
    if (newNode) result.push(newNode);
  });
  return result;
};
