import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { TokenCounter } from './TokenCounter';

function Live() {
  const [n, setN] = useState(1280);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v > 9000 ? 1280 : v + 140 + Math.round(Math.random() * 220))), 900);
    return () => clearInterval(id);
  }, []);
  return <TokenCounter tokens={n} max={200000} cost={n * 0.000003} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Token counter',
    slug: 'token-counter',
    category: 'AI & Agent',
    description: 'Streaming token and cost readout with rolling digits.',
  },
  demos: [
    { name: 'Live stream', code: `<TokenCounter tokens={n} max={200000} cost={n * 0.000003} />`, Component: Live },
    { name: 'Static', code: `<TokenCounter tokens={48210} />`, Component: () => <TokenCounter tokens={48210} /> },
  ],
};

export default demo;
