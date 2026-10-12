import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { AlertDialog, AlertDialogTrigger } from './AlertDialog';

const demo: DemoModule = {
  meta: {
    title: 'Alert dialog',
    slug: 'alert-dialog',
    category: 'Overlays',
    description:
      'Confirmation dialog for destructive or irreversible actions. role="alertdialog", focus starts on Cancel, outside click does not dismiss.',
  },
  demos: [
    {
      name: 'Destructive',
      code: `<AlertDialogTrigger>
  <Button variant="danger">Delete workspace</Button>
  <AlertDialog variant="danger" title="Delete Q4 Revenue?" confirmLabel="Delete" onConfirm={…}>
    This permanently removes 14 dashboards and 3 shared reports. This can't be undone.
  </AlertDialog>
</AlertDialogTrigger>`,
      Component: () => (
        <AlertDialogTrigger>
          <Button variant="danger">Delete workspace</Button>
          <AlertDialog variant="danger" title="Delete Q4 Revenue?" confirmLabel="Delete">
            This permanently removes 14 dashboards and 3 shared reports. This can&apos;t be undone.
          </AlertDialog>
        </AlertDialogTrigger>
      ),
    },
    {
      name: 'Default confirm',
      code: `<AlertDialogTrigger>
  <Button variant="secondary">Publish report</Button>
  <AlertDialog title="Publish October close report?" confirmLabel="Publish">
    Everyone with the link will be able to view it.
  </AlertDialog>
</AlertDialogTrigger>`,
      Component: () => (
        <AlertDialogTrigger>
          <Button variant="secondary">Publish report</Button>
          <AlertDialog title="Publish October close report?" confirmLabel="Publish">
            Everyone with the link will be able to view it.
          </AlertDialog>
        </AlertDialogTrigger>
      ),
    },
  ],
};

export default demo;
