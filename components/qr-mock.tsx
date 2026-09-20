const N = 15;

function isFinderZone(r: number, c: number): boolean {
  const inBox = (br: number, bc: number) => br >= 0 && br < 7 && bc >= 0 && bc < 7;
  return inBox(r, c) || inBox(r, c - (N - 7)) || inBox(r - (N - 7), c);
}

function finderCell(r: number, c: number, oR: number, oC: number): boolean {
  const lr = r - oR;
  const lc = c - oC;
  const outer = (lr === 0 || lr === 6 || lc === 0 || lc === 6) && lr >= 0 && lr < 7 && lc >= 0 && lc < 7;
  const inner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  return outer || inner;
}

function buildCells(seed: string): boolean[] {
  let h = 2166136261;
  const cells: boolean[] = [];
  for (let i = 0; i < N * N; i++) {
    h ^= (seed.charCodeAt(i % seed.length) || 0) + i * 31;
    h = Math.imul(h, 16777619);
    if (isFinderZone(Math.floor(i / N), i % N)) {
      if (i % N < 7 && Math.floor(i / N) < 7) {
        cells.push(finderCell(Math.floor(i / N), i % N, 0, 0));
      } else if (i % N >= N - 7 && Math.floor(i / N) < 7) {
        cells.push(finderCell(Math.floor(i / N), i % N, 0, N - 7));
      } else {
        cells.push(finderCell(Math.floor(i / N), i % N, N - 7, 0));
      }
    } else {
      cells.push(((h >>> 0) & 1) === 1);
    }
  }
  return cells;
}

export function QrMock({ seed, className = "" }: { seed: string; className?: string }) {
  const cells = buildCells(seed);
  return (
    <svg
      viewBox={`0 0 ${N} ${N}`}
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label="Código QR de demostración"
    >
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % N} y={Math.floor(i / N)} width="1" height="1" fill="#0f172a" /> : null,
      )}
    </svg>
  );
}