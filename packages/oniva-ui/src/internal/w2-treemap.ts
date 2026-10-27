/** Order-preserving squarified treemap (percent coordinates). Items keep the order they are given in. */
export interface TreemapRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function squarify(items: Array<{ id: string; value: number }>, width = 100, height = 100): TreemapRect[] {
  const list = items.filter((i) => i.value > 0);
  const total = list.reduce((n, i) => n + i.value, 0);
  const out: TreemapRect[] = [];
  if (!total) return out;
  const area = width * height;
  const nodes = list.map((i) => ({ id: i.id, a: (i.value / total) * area }));
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;

  const worst = (row: number[], side: number) => {
    const s = row.reduce((n, v) => n + v, 0);
    const max = Math.max(...row);
    const min = Math.min(...row);
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };

  let i = 0;
  while (i < nodes.length) {
    const side = Math.min(w, h);
    const row = [nodes[i]!];
    let j = i + 1;
    while (j < nodes.length && worst([...row, nodes[j]!].map((n) => n.a), side) <= worst(row.map((n) => n.a), side)) {
      row.push(nodes[j]!);
      j++;
    }
    const sum = row.reduce((n, r) => n + r.a, 0);
    if (w >= h) {
      const colW = sum / h;
      let cy = y;
      for (const r of row) {
        const rh = r.a / colW;
        out.push({ id: r.id, x, y: cy, w: colW, h: rh });
        cy += rh;
      }
      x += colW;
      w -= colW;
    } else {
      const rowH = sum / w;
      let cx = x;
      for (const r of row) {
        const rw = r.a / rowH;
        out.push({ id: r.id, x: cx, y, w: rw, h: rowH });
        cx += rw;
      }
      y += rowH;
      h -= rowH;
    }
    i = j;
  }
  return out;
}
