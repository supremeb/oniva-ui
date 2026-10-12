import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { templates } from '../lib/site';
import { Dashboard } from '../templates/Dashboard';
import { AiChat } from '../templates/AiChat';
import { ProjectBoard } from '../templates/ProjectBoard';
import { MedicalReport } from '../templates/MedicalReport';
import { Settings } from '../templates/Settings';
import { ComponentsIndex } from './ComponentsIndex';

const styles = stylex.create({
  frame: { height: 'calc(100vh - 57px)', minHeight: 640 },
});

const map = {
  dashboard: Dashboard,
  'ai-chat': AiChat,
  'project-board': ProjectBoard,
  'medical-report': MedicalReport,
  settings: Settings,
} as const;

export function TemplatePage() {
  const { slug } = useParams();
  const T = map[slug as keyof typeof map];
  const meta = templates.find((t) => t.slug === slug);
  useEffect(() => {
    if (meta) document.title = `${meta.title} template · oniva/ui`;
    return () => {
      document.title = 'oniva/ui: React design system for dashboards and agent interfaces';
    };
  }, [meta]);
  if (!T) return <ComponentsIndex />;
  return (
    <div {...stylex.props(styles.frame)}>
      <T />
    </div>
  );
}
