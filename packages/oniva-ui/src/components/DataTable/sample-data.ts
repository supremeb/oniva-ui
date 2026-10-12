export type Fulfilment = 'Shipped' | 'Delivery failed' | 'Waiting';
export type Stage = 'waiting' | 'completed' | 'processing';

export interface Customer {
  id: string;
  name: string;
  stage: Stage;
  fulfilment: Fulfilment;
  updated: string;
  total: number;
  product: string;
}

const names = [
  'John Clarkson',
  'Aspen Lubin',
  'Michael Ekstrom',
  'Kianna Vaccaro',
  'Livia Saris',
  'Jaydon Aminoff',
  'Maria Lubin',
  'Ann Press',
  'Priya Natarajan',
  'Tomas Berg',
  'Hana Okafor',
  'Diego Marchetti',
  'Sofia Lindqvist',
  'Omar Haddad',
  'Chloe Bennett',
  'Ravi Menon',
  'Elena Petrova',
  'Marcus Webb',
  'Yuki Tanaka',
  'Isabel Duarte',
  'Noah Fitzgerald',
  'Amara Nwosu',
  'Lucas Moreau',
  'Zara Qureshi',
  'Felix Hartmann',
  'Mei Lin',
  'Callum Reid',
  'Nadia Volkov',
  'Jonas Eriksen',
  'Tara Whitfield',
  'Andre Silva',
  'Grace Holloway',
  'Kenji Mori',
  'Leila Rahimi',
  'Owen Gallagher',
  'Sienna Costa',
  'Viktor Novak',
  'Alma Reyes',
  'Dev Kapoor',
  'Hannah Meyer',
  'Rafael Ortiz',
  'Ingrid Solberg',
  'Theo Laurent',
  'Mira Shah',
  'Jack Donnelly',
  'Selin Aydin',
  'Blake Turner',
  'Naomi Frost',
];
const stages: Stage[] = ['waiting', 'completed', 'processing'];
const fulfilments: Fulfilment[] = ['Delivery failed', 'Shipped', 'Waiting'];
const products = ['Starter', 'Growth', 'Scale', 'Enterprise'];

export const customers: Customer[] = names.map((name, i) => {
  const month = ((i * 5) % 12) + 1;
  const day = ((i * 7) % 27) + 1;
  return {
    id: `cus_${1000 + i}`,
    name,
    stage: stages[i % 3]!,
    fulfilment: fulfilments[(i + (i > 3 ? 1 : 0)) % 3]!,
    updated: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    total: 49 + ((i * 337) % 2400) + (i % 4) * 0.5,
    product: products[(i * 3) % 4]!,
  };
});
