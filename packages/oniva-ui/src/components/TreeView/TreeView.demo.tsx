import { FileIcon, FolderIcon, FolderOpenIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { TreeView, TreeViewItem } from './TreeView';

const demo: DemoModule = {
  meta: {
    title: 'Tree view',
    slug: 'tree-view',
    category: 'Data display',
    description:
      'Hierarchical list with expand/collapse, arrow-key navigation and optional selection, built on React Aria Tree.',
  },
  demos: [
    {
      name: 'File explorer',
      code: `<TreeView aria-label="Project files" selectionMode="single" defaultExpandedKeys={['src', 'components']}>
  <TreeViewItem id="src" title="src" icon={<FolderOpenIcon size={16} />}>
    <TreeViewItem id="components" title="components" icon={<FolderIcon size={16} />}>
      <TreeViewItem id="button" title="Button.tsx" icon={<FileIcon size={16} />} />
      <TreeViewItem id="table" title="Table.tsx" icon={<FileIcon size={16} />} />
    </TreeViewItem>
    <TreeViewItem id="index" title="index.ts" icon={<FileIcon size={16} />} />
  </TreeViewItem>
  <TreeViewItem id="pkg" title="package.json" icon={<FileIcon size={16} />} />
</TreeView>`,
      Component: () => (
        <div style={{ maxWidth: 320 }}>
          <TreeView
            aria-label="Project files"
            selectionMode="single"
            defaultExpandedKeys={['src', 'components']}
            defaultSelectedKeys={['table']}
          >
            <TreeViewItem id="src" title="src" icon={<FolderOpenIcon size={16} />}>
              <TreeViewItem id="components" title="components" icon={<FolderIcon size={16} />}>
                <TreeViewItem id="button" title="Button.tsx" icon={<FileIcon size={16} />} />
                <TreeViewItem id="table" title="Table.tsx" icon={<FileIcon size={16} />} />
                <TreeViewItem id="badge" title="Badge.tsx" icon={<FileIcon size={16} />} />
              </TreeViewItem>
              <TreeViewItem id="tokens" title="tokens" icon={<FolderIcon size={16} />}>
                <TreeViewItem id="colors" title="colors.stylex.ts" icon={<FileIcon size={16} />} />
              </TreeViewItem>
              <TreeViewItem id="index" title="index.ts" icon={<FileIcon size={16} />} />
            </TreeViewItem>
            <TreeViewItem id="pkg" title="package.json" icon={<FileIcon size={16} />} />
          </TreeView>
        </div>
      ),
    },
    {
      name: 'Org chart, multi-select',
      code: `<TreeView aria-label="Teams" selectionMode="multiple" defaultExpandedKeys={['eng']}>
  <TreeViewItem id="eng" title="Engineering">
    <TreeViewItem id="web" title="Web platform" />
    <TreeViewItem id="data" title="Data" />
  </TreeViewItem>
  <TreeViewItem id="design" title="Design" />
</TreeView>`,
      Component: () => (
        <div style={{ maxWidth: 320 }}>
          <TreeView aria-label="Teams" selectionMode="multiple" defaultExpandedKeys={['eng']}>
            <TreeViewItem id="eng" title="Engineering">
              <TreeViewItem id="web" title="Web platform" />
              <TreeViewItem id="data" title="Data" />
            </TreeViewItem>
            <TreeViewItem id="design" title="Design">
              <TreeViewItem id="brand" title="Brand" />
            </TreeViewItem>
          </TreeView>
        </div>
      ),
    },
  ],
};

export default demo;
