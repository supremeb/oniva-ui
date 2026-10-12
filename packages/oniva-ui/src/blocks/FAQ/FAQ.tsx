import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Accordion, AccordionItem } from '../../components/Accordion/Accordion';

const styles = stylex.create({ wrap: { marginInline: 'auto', maxWidth: 720 } });

export interface FAQItem {
  question: string;
  answer: ReactNode;
}

export const defaultFaqs: FAQItem[] = [
  { question: 'How does Oniva trace my agents?', answer: 'Add our SDK or route traffic through the Oniva gateway. Both capture prompts, tool calls, latency and cost with no changes to your agent logic.' },
  { question: 'Can I set a hard spending limit?', answer: 'Yes. Budgets can be scoped to a team, agent or customer, and Oniva pauses runs the moment a cap is reached.' },
  { question: 'Where is my data stored?', answer: 'In the US by default. Scale workspaces can pin traces to the EU, and you can redact fields before they leave your network.' },
  { question: 'Do you support self-hosting?', answer: 'The data plane can run in your VPC. The control plane stays hosted so you always get updates.' },
  { question: 'What happens if I exceed my plan?', answer: 'Nothing breaks. We keep tracing and bill overage at a flat per-run rate, with an alert before it happens.' },
];

export interface FAQProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  items?: FAQItem[];
  title?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function FAQ({ items = defaultFaqs, title = 'Questions, answered', className, xstyle, ref, ...rest }: FAQProps) {
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead center eyebrow="FAQ" title={title} />
        <div {...stylex.props(styles.wrap)}>
          <Accordion variant="cards" defaultExpandedKeys={['q0']}>
            {items.map((f, i) => (
              <AccordionItem key={f.question} id={`q${i}`} title={f.question}>
                <p {...stylex.props(bs.p)}>{f.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
