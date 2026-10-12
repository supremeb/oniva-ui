import { FileText, FolderOpen, Image } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Badge } from '../Badge';
import { List, ListItem } from './List';

const demo: DemoModule = {
  meta: {
    title: 'List',
    slug: 'list',
    category: 'Data display',
    description:
      'Rich interactive list on React Aria GridList. Rows can have icons, descriptions, trailing content and checkbox selection.',
  },
  demos: [
    {
      name: 'With checkbox selection',
      code: `<List aria-label="Recent files" selectionMode="multiple" defaultSelectedKeys={['q3']}>
  <ListItem id="q3" icon={<FileText size={16} />} description="Edited 2h ago" trailing="2.4 MB">Q3 revenue report.pdf</ListItem>
  <ListItem id="brand" icon={<Image size={16} />} description="Edited yesterday" trailing="8.1 MB">Brand assets.zip</ListItem>
  <ListItem id="contracts" icon={<FolderOpen size={16} />} description="12 items" trailing="Shared">Contracts</ListItem>
</List>`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <List aria-label="Recent files" selectionMode="multiple" defaultSelectedKeys={['q3']}>
            <ListItem
              id="q3"
              icon={<FileText size={16} />}
              description="Edited 2h ago"
              trailing="2.4 MB"
            >
              Q3 revenue report.pdf
            </ListItem>
            <ListItem
              id="brand"
              icon={<Image size={16} />}
              description="Edited yesterday"
              trailing="8.1 MB"
            >
              Brand assets.zip
            </ListItem>
            <ListItem
              id="contracts"
              icon={<FolderOpen size={16} />}
              description="12 items"
              trailing="Shared"
            >
              Contracts
            </ListItem>
          </List>
        </div>
      ),
    },
    {
      name: 'Static rows with badges',
      code: `<List aria-label="Deployments">
  <ListItem id="1" description="main · 4 min ago" trailing={<Badge variant="success" dot>Live</Badge>}>oniva-site</ListItem>
  <ListItem id="2" description="feat/pricing · 1h ago" trailing={<Badge variant="warning" dot>Building</Badge>}>oniva-docs</ListItem>
</List>`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <List aria-label="Deployments">
            <ListItem
              id="1"
              description="main · 4 min ago"
              trailing={
                <Badge variant="success" dot>
                  Live
                </Badge>
              }
            >
              oniva-site
            </ListItem>
            <ListItem
              id="2"
              description="feat/pricing · 1h ago"
              trailing={
                <Badge variant="warning" dot>
                  Building
                </Badge>
              }
            >
              oniva-docs
            </ListItem>
            <ListItem
              id="3"
              description="main · 2d ago"
              trailing={
                <Badge variant="danger" dot>
                  Failed
                </Badge>
              }
            >
              oniva-api
            </ListItem>
          </List>
        </div>
      ),
    },
  ],
};

export default demo;
