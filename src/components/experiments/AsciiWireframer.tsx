import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, MousePointer2, Square, Trash2, Type } from 'lucide-react';

type Tool = 'box' | 'text' | 'select';

type ElementKind = 'box' | 'text';
type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';
type WireframeStyle = 'ascii' | 'unicode';

interface Cell {
  x: number;
  y: number;
}

interface Box {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TextItem {
  id: string;
  x: number;
  y: number;
  value: string;
}

interface Selection {
  kind: ElementKind;
  id: string;
}

interface DragState {
  mode: 'draw-box' | 'move' | 'marquee' | 'resize';
  start: Cell;
  current: Cell;
  selected?: Selection[];
  resize?: {
    id: string;
    handle: ResizeHandle;
    origin: Box;
  };
  move?: {
    boxes: Box[];
    texts: TextItem[];
  };
}

interface EditState {
  id: string;
  x: number;
  y: number;
  value: string;
  isNew: boolean;
}

interface ExportState {
  rows: number;
  cols: number;
  boxes: Box[];
  texts: TextItem[];
  marginRight?: number;
  marginBottom?: number;
  style?: WireframeStyle;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const isSelectionEqual = (a: Selection, b: Selection) => a.id === b.id && a.kind === b.kind;

const getStyleChars = (style: WireframeStyle) => {
  if (style === 'unicode') {
    return {
      h: '─',
      v: '│',
      tl: '┌',
      tr: '┐',
      bl: '└',
      br: '┘',
      cross: '┼',
    };
  }
  return {
    h: '-',
    v: '|',
    tl: '+',
    tr: '+',
    bl: '+',
    br: '+',
    cross: '+',
  };
};

function rectFromCells(a: Cell, b: Cell) {
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x, b.x);
  const y2 = Math.max(a.y, b.y);
  return { x: x1, y: y1, w: x2 - x1 + 1, h: y2 - y1 + 1 };
}

function cellsEqual(a?: Cell | null, b?: Cell | null) {
  return !!(a && b && a.x === b.x && a.y === b.y);
}

function makeGrid(rows: number, cols: number, fill = ' ') {
  const g = new Array(rows);
  for (let r = 0; r < rows; r += 1) {
    const row = new Array(cols);
    row.fill(fill);
    g[r] = row;
  }
  return g;
}

function putChar(grid: string[][], x: number, y: number, ch: string, chars: ReturnType<typeof getStyleChars>) {
  if (y < 0 || y >= grid.length) return;
  if (x < 0 || x >= grid[0].length) return;

  const cur = grid[y][x];
  if (cur === ' ') {
    grid[y][x] = ch;
    return;
  }

  const isLine = (c: string) => c === chars.h || c === chars.v;
  const isCorner = (c: string) => c === chars.tl || c === chars.tr || c === chars.bl || c === chars.br;
  if (ch === chars.cross || cur === chars.cross) {
    grid[y][x] = chars.cross;
    return;
  }
  if (isLine(cur) && isLine(ch)) {
    grid[y][x] = chars.cross;
    return;
  }
  if (isCorner(ch) || isCorner(cur)) {
    grid[y][x] = isCorner(ch) ? ch : cur;
    return;
  }

  const isText = (c: string) => !(c === ' ' || isLine(c) || isCorner(c) || c === chars.cross);
  if (isText(ch)) {
    grid[y][x] = ch;
  } else {
    grid[y][x] = cur;
  }
}

function drawBoxASCII(grid: string[][], box: Box, chars: ReturnType<typeof getStyleChars>) {
  const { x, y, w, h } = box;
  if (w <= 0 || h <= 0) return;

  const x0 = x;
  const y0 = y;
  const x1 = x + w - 1;
  const y1 = y + h - 1;

  if (w === 1 && h === 1) {
    putChar(grid, x0, y0, chars.cross, chars);
    return;
  }

  for (let xi = x0 + 1; xi <= x1 - 1; xi += 1) {
    putChar(grid, xi, y0, chars.h, chars);
    putChar(grid, xi, y1, chars.h, chars);
  }

  for (let yi = y0 + 1; yi <= y1 - 1; yi += 1) {
    putChar(grid, x0, yi, chars.v, chars);
    putChar(grid, x1, yi, chars.v, chars);
  }

  putChar(grid, x0, y0, chars.tl, chars);
  putChar(grid, x1, y0, chars.tr, chars);
  putChar(grid, x0, y1, chars.bl, chars);
  putChar(grid, x1, y1, chars.br, chars);

  if (h === 1) {
    for (let xi = x0; xi <= x1; xi += 1) {
      const ch = xi === x0 ? chars.tl : xi === x1 ? chars.tr : chars.h;
      putChar(grid, xi, y0, ch, chars);
    }
  }
  if (w === 1) {
    for (let yi = y0; yi <= y1; yi += 1) {
      const ch = yi === y0 ? chars.tl : yi === y1 ? chars.bl : chars.v;
      putChar(grid, x0, yi, ch, chars);
    }
  }
}

function drawTextASCII(grid: string[][], text: TextItem, chars: ReturnType<typeof getStyleChars>) {
  const { x, y, value } = text;
  if (!value) return;
  for (let i = 0; i < value.length; i += 1) {
    putChar(grid, x + i, y, value[i], chars);
  }
}

function exportASCII({ rows, cols, boxes, texts, marginRight = 0, marginBottom = 0, style = 'ascii' }: ExportState) {
  const R = rows + marginBottom;
  const C = cols + marginRight;
  const grid = makeGrid(R, C, ' ');
  const chars = getStyleChars(style);

  for (let i = 0; i < boxes.length; i += 1) drawBoxASCII(grid, boxes[i], chars);
  for (let i = 0; i < texts.length; i += 1) drawTextASCII(grid, texts[i], chars);

  const lines = grid.map((row) => {
    let s = row.join('');
    s = s.replace(/\s+$/g, '');
    return s.length ? s : '';
  });

  while (lines.length && lines[lines.length - 1] === '') lines.pop();

  return lines.join('\n');
}

function resizeBox(origin: Box, handle: ResizeHandle, cell: Cell, rows: number, cols: number) {
  const x0 = origin.x;
  const y0 = origin.y;
  const x1 = origin.x + origin.w - 1;
  const y1 = origin.y + origin.h - 1;

  if (handle === 'nw') {
    const nx0 = clamp(cell.x, 0, x1);
    const ny0 = clamp(cell.y, 0, y1);
    return { ...origin, x: nx0, y: ny0, w: x1 - nx0 + 1, h: y1 - ny0 + 1 };
  }

  if (handle === 'ne') {
    const nx1 = clamp(cell.x, x0, cols - 1);
    const ny0 = clamp(cell.y, 0, y1);
    return { ...origin, x: x0, y: ny0, w: nx1 - x0 + 1, h: y1 - ny0 + 1 };
  }

  if (handle === 'sw') {
    const nx0 = clamp(cell.x, 0, x1);
    const ny1 = clamp(cell.y, y0, rows - 1);
    return { ...origin, x: nx0, y: y0, w: x1 - nx0 + 1, h: ny1 - y0 + 1 };
  }

  const nx1 = clamp(cell.x, x0, cols - 1);
  const ny1 = clamp(cell.y, y0, rows - 1);
  return { ...origin, x: x0, y: y0, w: nx1 - x0 + 1, h: ny1 - y0 + 1 };
}

function ElementBadge({ kind }: { kind: ElementKind }) {
  return (
    <span className="element-badge">
      {kind}
    </span>
  );
}

function ToolbarButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`toolbar-btn ${active ? 'active' : ''}`}
      type="button"
    >
      {children}
    </button>
  );
}

export default function AsciiWireframer() {
  const [tool, setTool] = useState<Tool>('box');
  const [rows, setRows] = useState(28);
  const [cols, setCols] = useState(64);
  const cellPx = 12;
  const [style, setStyle] = useState<WireframeStyle>('ascii');

  const [boxes, setBoxes] = useState<Box[]>(() => [
    { id: uid(), x: 2, y: 2, w: 22, h: 7 },
    { id: uid(), x: 26, y: 2, w: 36, h: 7 },
    { id: uid(), x: 2, y: 11, w: 60, h: 14 },
  ]);
  const [texts, setTexts] = useState<TextItem[]>(() => [
    { id: uid(), x: 4, y: 4, value: 'Login' },
    { id: uid(), x: 28, y: 4, value: 'Dashboard' },
    { id: uid(), x: 4, y: 13, value: 'Content' },
  ]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLTextAreaElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<Selection[]>([]);

  const [editing, setEditing] = useState<EditState | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastEditingIdRef = useRef<string | null>(null);

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const getCellFromEvent = (e: React.PointerEvent<HTMLElement>) => {
    const el = boardRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const x = clamp(Math.floor(px / cellPx), 0, cols - 1);
    const y = clamp(Math.floor(py / cellPx), 0, rows - 1);
    return { x, y };
  };

  const hitTest = (cell: Cell): Selection | null => {
    for (let i = texts.length - 1; i >= 0; i -= 1) {
      const t = texts[i];
      const len = (t.value && t.value.length) || 0;
      if (cell.y === t.y && cell.x >= t.x && cell.x < t.x + Math.max(1, len)) {
        return { kind: 'text', id: t.id };
      }
    }
    for (let i = boxes.length - 1; i >= 0; i -= 1) {
      const b = boxes[i];
      if (cell.x >= b.x && cell.x < b.x + b.w && cell.y >= b.y && cell.y < b.y + b.h) {
        return { kind: 'box', id: b.id };
      }
    }
    return null;
  };

  const startDrawBox = (startCell: Cell) => {
    setDrag({ mode: 'draw-box', start: startCell, current: startCell });
  };

  const startMoveSelection = (startCell: Cell, selection: Selection[]) => {
    if (!selection.length) return;
    const boxIds = new Set(selection.filter((item) => item.kind === 'box').map((item) => item.id));
    const textIds = new Set(selection.filter((item) => item.kind === 'text').map((item) => item.id));
    const moveBoxes = boxes.filter((b) => boxIds.has(b.id)).map((b) => ({ ...b }));
    const moveTexts = texts.filter((t) => textIds.has(t.id)).map((t) => ({ ...t }));
    setDrag({ mode: 'move', start: startCell, current: startCell, selected: selection, move: { boxes: moveBoxes, texts: moveTexts } });
  };

  const startResizeBox = (startCell: Cell, box: Box, handle: ResizeHandle) => {
    setDrag({
      mode: 'resize',
      start: startCell,
      current: startCell,
      resize: {
        id: box.id,
        handle,
        origin: { ...box },
      },
    });
  };

  const beginTextEdit = ({ x, y, value = '', id = null, isNew = true }: { x: number; y: number; value?: string; id?: string | null; isNew?: boolean }) => {
    setEditing({ id: id || uid(), x, y, value, isNew: !!isNew });
    setTool('text');
  };

  const commitTextEdit = () => {
    if (!editing) return;
    const v = String(editing.value || '').replace(/[\r\n]/g, '');
    if (!v.trim()) {
      setEditing(null);
      return;
    }

    setTexts((prev) => {
      const idx = prev.findIndex((t) => t.id === editing.id);
      const next = prev.slice();
      const entry = { id: editing.id, x: editing.x, y: editing.y, value: v };
      if (idx === -1) next.push(entry);
      else next[idx] = entry;
      return next;
    });

    setSelected([{ kind: 'text', id: editing.id }]);
    setEditing(null);
  };

  const cancelTextEdit = () => {
    setEditing(null);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (lastEditingIdRef.current !== editing.id) {
        inputRef.current.select();
        lastEditingIdRef.current = editing.id;
      }
      return;
    }
    lastEditingIdRef.current = null;
  }, [editing?.id]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cell = getCellFromEvent(e);

    if (editing) {
      commitTextEdit();
    }

    if (tool === 'box') {
      setSelected([]);
      startDrawBox(cell);
      return;
    }

    if (tool === 'text') {
      const hit = hitTest(cell);
      if (hit && hit.kind === 'text') {
        const t = texts.find((tt) => tt.id === hit.id);
        if (t) beginTextEdit({ id: t.id, x: t.x, y: t.y, value: t.value, isNew: false });
      } else {
        beginTextEdit({ x: cell.x, y: cell.y, value: '', isNew: true });
      }
      setSelected([]);
      return;
    }

    const hit = hitTest(cell);
    if (hit) {
      if (e.shiftKey) {
        const exists = selected.some((sel) => isSelectionEqual(sel, hit));
        const nextSelected = exists ? selected.filter((sel) => !isSelectionEqual(sel, hit)) : selected.concat(hit);
        setSelected(nextSelected);
      } else {
        const alreadySelected = selected.some((sel) => isSelectionEqual(sel, hit));
        const nextSelected = alreadySelected ? selected : [hit];
        setSelected(nextSelected);
        startMoveSelection(cell, nextSelected);
      }
    } else {
      if (!e.shiftKey) {
        setSelected([]);
      }
      setDrag({ mode: 'marquee', start: cell, current: cell });
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const cell = getCellFromEvent(e);
    if (cellsEqual(cell, drag.current)) return;
    if (drag.mode === 'move' && drag.move) {
      const dx = cell.x - drag.start.x;
      const dy = cell.y - drag.start.y;

      if (drag.move.boxes.length) {
        setBoxes((prev) =>
          prev.map((b) => {
            const origin = drag.move?.boxes.find((item) => item.id === b.id);
            if (!origin) return b;
            const nx = clamp(origin.x + dx, 0, cols - origin.w);
            const ny = clamp(origin.y + dy, 0, rows - origin.h);
            return { ...b, x: nx, y: ny };
          })
        );
      }

      if (drag.move.texts.length) {
        setTexts((prev) =>
          prev.map((t) => {
            const origin = drag.move?.texts.find((item) => item.id === t.id);
            if (!origin) return t;
            const nx = clamp(origin.x + dx, 0, cols - 1);
            const ny = clamp(origin.y + dy, 0, rows - 1);
            return { ...t, x: nx, y: ny };
          })
        );
      }

      setDrag((d) => (d ? { ...d, current: cell } : null));
      return;
    }
    if (drag.mode === 'resize' && drag.resize) {
      const nextBox = resizeBox(drag.resize.origin, drag.resize.handle, cell, rows, cols);
      setBoxes((prev) => prev.map((b) => (b.id === drag.resize?.id ? nextBox : b)));
      setDrag((d) => (d ? { ...d, current: cell } : null));
      return;
    }

    setDrag((d) => (d ? { ...d, current: cell } : null));
  };

  const onPointerUp = () => {
    if (!drag) return;

    if (drag.mode === 'draw-box') {
      const r = rectFromCells(drag.start, drag.current);
      const box = {
        id: uid(),
        x: clamp(r.x, 0, cols - 1),
        y: clamp(r.y, 0, rows - 1),
        w: clamp(r.w, 1, cols - r.x),
        h: clamp(r.h, 1, rows - r.y),
      };
      setBoxes((prev) => prev.concat([box]));
      setSelected([{ kind: 'box', id: box.id }]);
    }

    if (drag.mode === 'move' && drag.selected) {
      const dx = drag.current.x - drag.start.x;
      const dy = drag.current.y - drag.start.y;

      if (dx !== 0 || dy !== 0) {
        if (drag.move?.boxes.length) {
          setBoxes((prev) =>
            prev.map((b) => {
              const origin = drag.move?.boxes.find((item) => item.id === b.id);
              if (!origin) return b;
              const nx = clamp(origin.x + dx, 0, cols - origin.w);
              const ny = clamp(origin.y + dy, 0, rows - origin.h);
              return { ...b, x: nx, y: ny };
            })
          );
        }

        if (drag.move?.texts.length) {
          setTexts((prev) =>
            prev.map((t) => {
              const origin = drag.move?.texts.find((item) => item.id === t.id);
              if (!origin) return t;
              const nx = clamp(origin.x + dx, 0, cols - 1);
              const ny = clamp(origin.y + dy, 0, rows - 1);
              return { ...t, x: nx, y: ny };
            })
          );
        }
      }
    }

    if (drag.mode === 'marquee') {
      const r = rectFromCells(drag.start, drag.current);
      const selectedBoxes = boxes.filter((b) => {
        const bx1 = b.x;
        const by1 = b.y;
        const bx2 = b.x + b.w - 1;
        const by2 = b.y + b.h - 1;
        const overlaps = r.x <= bx2 && r.x + r.w - 1 >= bx1 && r.y <= by2 && r.y + r.h - 1 >= by1;
        return overlaps;
      });
      const selectedTexts = texts.filter((t) => {
        const len = (t.value && t.value.length) || 1;
        const tx1 = t.x;
        const tx2 = t.x + len - 1;
        const ty = t.y;
        const overlaps = r.y <= ty && r.y + r.h - 1 >= ty && r.x <= tx2 && r.x + r.w - 1 >= tx1;
        return overlaps;
      });

      setSelected([
        ...selectedBoxes.map((b) => ({ kind: 'box' as const, id: b.id })),
        ...selectedTexts.map((t) => ({ kind: 'text' as const, id: t.id })),
      ]);
    }

    if (drag.mode === 'resize' && drag.resize) {
      const nextBox = resizeBox(drag.resize.origin, drag.resize.handle, drag.current, rows, cols);
      setBoxes((prev) => prev.map((b) => (b.id === drag.resize?.id ? nextBox : b)));
    }

    setDrag(null);
  };

  const previewRect = useMemo(() => {
    if (!drag || (drag.mode !== 'draw-box' && drag.mode !== 'marquee')) return null;
    return rectFromCells(drag.start, drag.current);
  }, [drag]);

  const ascii = useMemo(() => {
    return exportASCII({ rows, cols, boxes, texts, style });
  }, [rows, cols, boxes, texts, style]);

  const copyAscii = async () => {
    try {
      await navigator.clipboard.writeText(ascii);
      setCopied(true);
    } catch {
      const output = outputRef.current;
      if (output) {
        output.focus();
        output.select();
        if (document.execCommand) document.execCommand('copy');
        setCopied(true);
      }
    }

    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1400);
  };

  const removeSelected = () => {
    if (!selected.length) return;
    const selectedBoxes = new Set(selected.filter((item) => item.kind === 'box').map((item) => item.id));
    const selectedTexts = new Set(selected.filter((item) => item.kind === 'text').map((item) => item.id));
    if (selectedBoxes.size > 0) setBoxes((prev) => prev.filter((b) => !selectedBoxes.has(b.id)));
    if (selectedTexts.size > 0) setTexts((prev) => prev.filter((t) => !selectedTexts.has(t.id)));
    setSelected([]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (editing) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitTextEdit();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          cancelTextEdit();
        }
        return;
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && selected.length) {
        e.preventDefault();
        removeSelected();
        return;
      }

      if (!selected.length) return;

      const step = e.shiftKey ? 5 : 1;
      const move = (dx: number, dy: number) => {
        const selectedBoxes = new Set(selected.filter((item) => item.kind === 'box').map((item) => item.id));
        const selectedTexts = new Set(selected.filter((item) => item.kind === 'text').map((item) => item.id));

        if (selectedBoxes.size > 0) {
          setBoxes((prev) =>
            prev.map((b) => {
              if (!selectedBoxes.has(b.id)) return b;
              const nx = clamp(b.x + dx, 0, cols - b.w);
              const ny = clamp(b.y + dy, 0, rows - b.h);
              return { ...b, x: nx, y: ny };
            })
          );
        }

        if (selectedTexts.size > 0) {
          setTexts((prev) =>
            prev.map((t) => {
              if (!selectedTexts.has(t.id)) return t;
              const nx = clamp(t.x + dx, 0, cols - 1);
              const ny = clamp(t.y + dy, 0, rows - 1);
              return { ...t, x: nx, y: ny };
            })
          );
        }
      };

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move(-step, 0);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        move(step, 0);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move(0, -step);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        move(0, step);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, cols, rows, editing]);

  const singleSelection = selected.length === 1 ? selected[0] : null;
  const selectedBox = singleSelection && singleSelection.kind === 'box' ? boxes.find((b) => b.id === singleSelection.id) : null;
  const selectedText = singleSelection && singleSelection.kind === 'text' ? texts.find((t) => t.id === singleSelection.id) : null;

  const boardW = cols * cellPx;
  const boardH = rows * cellPx;
  const handleSize = 10;

  return (
    <div className="ascii-wireframer-wrapper">
      <div className="layout-grid">
        <div className="panel">
          <div className="toolbar">
            <div className="toolbar-group">
              <ToolbarButton active={tool === 'box'} onClick={() => setTool('box')}>
                <Square className="icon-sm" />
                Box
              </ToolbarButton>
              <ToolbarButton active={tool === 'text'} onClick={() => setTool('text')}>
                <Type className="icon-sm" />
                Text
              </ToolbarButton>
              <ToolbarButton active={tool === 'select'} onClick={() => setTool('select')}>
                <MousePointer2 className="icon-sm" />
                Select
              </ToolbarButton>

              <div className="style-toggles">
                {(['ascii', 'unicode'] as WireframeStyle[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStyle(opt)}
                    className={`style-btn ${style === opt ? 'active' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={removeSelected}
                disabled={!selected.length}
                className={`delete-btn ${!selected.length ? 'disabled' : ''}`}
                title="Delete selected (Backspace/Delete)"
              >
                <Trash2 className="icon-sm" />
                {selected.length > 1 ? `Delete (${selected.length})` : 'Delete'}
              </button>
            </div>

            <div className="toolbar-stats">
              <label className="stat-input">
                <span className="stat-label">Rows</span>
                <input
                  className="range-input"
                  type="range"
                  min={8}
                  max={120}
                  value={rows}
                  onChange={(e) => setRows(clamp(parseInt(e.target.value || '0', 10) || 28, 8, 200))}
                />
                <span className="stat-value">{rows}</span>
              </label>
              <label className="stat-input">
                <span className="stat-label">Cols</span>
                <input
                  className="range-input"
                  type="range"
                  min={16}
                  max={240}
                  value={cols}
                  onChange={(e) => setCols(clamp(parseInt(e.target.value || '0', 10) || 64, 16, 400))}
                />
                <span className="stat-value">{cols}</span>
              </label>

              <div className="help-text">
                Select + Arrows moves. Shift = 5 cells. Drag to marquee select.
              </div>
            </div>
          </div>

          <div className="canvas-container">
            <div
              ref={boardRef}
              className={`canvas-board ${tool === 'box' ? 'cursor-crosshair' : tool === 'text' ? 'cursor-text' : 'cursor-default'}`}
              style={{
                width: boardW,
                height: boardH,
                backgroundSize: `${cellPx}px ${cellPx}px`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {boxes.map((b) => {
                const isSel = selected.some((item) => item.kind === 'box' && item.id === b.id);
                const canResize = tool === 'select' && selected.length === 1 && isSel;
                return (
                  <div
                    key={b.id}
                    className={`box-element ${isSel ? 'selected' : ''}`}
                    style={{
                      left: b.x * cellPx,
                      top: b.y * cellPx,
                      width: b.w * cellPx,
                      height: b.h * cellPx,
                    }}
                  >
                    {canResize ? (
                      <>
                        <div
                          className="resize-handle nw"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            startResizeBox(getCellFromEvent(e), b, 'nw');
                          }}
                        />
                        <div
                          className="resize-handle ne"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            startResizeBox(getCellFromEvent(e), b, 'ne');
                          }}
                        />
                        <div
                          className="resize-handle sw"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            startResizeBox(getCellFromEvent(e), b, 'sw');
                          }}
                        />
                        <div
                          className="resize-handle se"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            startResizeBox(getCellFromEvent(e), b, 'se');
                          }}
                        />
                      </>
                    ) : null}
                  </div>
                );
              })}

              {previewRect ? (
                <div
                  className={`preview-rect ${drag?.mode === 'marquee' ? 'marquee' : 'drawing'}`}
                  style={{
                    left: previewRect.x * cellPx,
                    top: previewRect.y * cellPx,
                    width: previewRect.w * cellPx,
                    height: previewRect.h * cellPx,
                  }}
                />
              ) : null}

              {texts.map((t) => {
                const isSel = selected.some((item) => item.kind === 'text' && item.id === t.id);
                return (
                  <div
                    key={t.id}
                    className={`text-element ${isSel ? 'selected' : ''}`}
                    style={{
                      left: t.x * cellPx,
                      top: t.y * cellPx,
                    }}
                  >
                    {t.value}
                  </div>
                );
              })}

              {editing ? (
                <div className="absolute" style={{ left: editing.x * cellPx, top: editing.y * cellPx }}>
                  <input
                    ref={inputRef}
                    className="text-input"
                    placeholder="type text..."
                    value={editing.value}
                    onChange={(e) =>
                      setEditing((ed) => {
                        if (!ed) return ed;
                        return { ...ed, value: e.target.value };
                      })
                    }
                    onBlur={commitTextEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitTextEdit();
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelTextEdit();
                      }
                    }}
                  />
                  <div className="input-hint">Enter = save / Esc = cancel</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="panel inspector">
            <div className="panel-header">
              <div className="panel-title">Inspector</div>
              {singleSelection ? <ElementBadge kind={singleSelection.kind} /> : selected.length ? (
                <span className="selection-count">{selected.length} selected</span>
              ) : null}
            </div>

            <div className="panel-content">
              {!selected.length ? (
                <div className="empty-state">Nothing selected. Use Select tool.</div>
              ) : selected.length > 1 ? (
                <div className="multi-select-info">
                  <div className="info-main">{selected.length} elements selected</div>
                  <div className="info-sub">Drag to move or press Delete to remove.</div>
                </div>
              ) : selectedBox ? (
                <div className="props-grid">
                  <div className="prop-item">
                    <div className="prop-label">x</div>
                    <div className="prop-value">{selectedBox.x}</div>
                  </div>
                  <div className="prop-item">
                    <div className="prop-label">y</div>
                    <div className="prop-value">{selectedBox.y}</div>
                  </div>
                  <div className="prop-item">
                    <div className="prop-label">w</div>
                    <div className="prop-value">{selectedBox.w}</div>
                  </div>
                  <div className="prop-item">
                    <div className="prop-label">h</div>
                    <div className="prop-value">{selectedBox.h}</div>
                  </div>
                  <div className="props-hint">
                    Drag to move. Use corner handles to resize.
                  </div>
                </div>
              ) : selectedText ? (
                <div className="text-props">
                  <div className="props-grid">
                    <div className="prop-item">
                      <div className="prop-label">x</div>
                      <div className="prop-value">{selectedText.x}</div>
                    </div>
                    <div className="prop-item">
                      <div className="prop-label">y</div>
                      <div className="prop-value">{selectedText.y}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="edit-text-btn"
                    onClick={() =>
                      beginTextEdit({
                        id: selectedText.id,
                        x: selectedText.x,
                        y: selectedText.y,
                        value: selectedText.value,
                        isNew: false,
                      })
                    }
                  >
                    Edit text
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="panel output">
            <div className="panel-header">
              <div className="panel-title">ASCII output</div>
              <button
                type="button"
                onClick={copyAscii}
                className="copy-btn"
              >
                <Copy className="icon-sm" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <textarea
              ref={outputRef}
              readOnly
              value={ascii}
              className="output-textarea"
              spellCheck={false}
            />

            <div className="output-hint">
              Export uses{' '}
              <span className="code-font">{style === 'unicode' ? '┌ ┐ └ ┘ ─ │' : '+ - |'}</span> for boxes. Text overwrites lines.
            </div>
          </div>

          <div className="panel snapping-info">
            <div className="panel-title">Snapping</div>
            <div className="info-sub">
              Everything snaps to a character grid. If you want freehand, this is the wrong experiment.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ascii-wireframer-wrapper {
          --panel-bg: var(--surface);
          --panel-border: var(--border);
          --canvas-bg: var(--bg);
          --grid-color: var(--border);
          --selection-color: var(--accent);
          --selection-bg: color-mix(in srgb, var(--accent) 15%, transparent);
          --toolbar-bg: var(--surface);
        }

        .layout-grid {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 1280px) {
          .layout-grid {
            grid-template-columns: minmax(0, 1fr) 320px;
          }
        }

        /* Panel Common */
        .panel {
          background: var(--panel-bg);
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .toolbar-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--panel-border);
          background: var(--bg);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
        }

        .toolbar-btn:hover {
          background: var(--panel-border);
          color: var(--text);
        }

        .toolbar-btn.active {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 10%, var(--bg));
          color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }

        .icon-sm {
          width: 1rem;
          height: 1rem;
        }

        .style-toggles {
          display: flex;
          padding: 2px;
          border: 1px solid var(--panel-border);
          border-radius: 6px;
          background: var(--bg);
        }

        .style-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .style-btn:hover {
          color: var(--text);
        }

        .style-btn.active {
          background: var(--accent);
          color: var(--bg);
        }

        .delete-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--panel-border);
          background: var(--bg);
          color: var(--text);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgb(220, 38, 38);
          color: rgb(220, 38, 38);
        }

        .delete-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .toolbar-stats {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .stat-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-label {
          width: 2.5rem;
        }

        .stat-value {
          width: 2rem;
          text-align: right;
          font-family: monospace;
          color: var(--text);
        }

        .range-input {
          height: 4px;
          width: 7rem;
          accent-color: var(--accent);
        }

        .help-text {
          margin-left: auto;
          color: var(--text-muted);
          opacity: 0.7;
        }

        /* Canvas */
        .canvas-container {
          position: relative;
          overflow: auto;
          max-height: 65vh;
          border: 1px solid var(--panel-border);
          border-radius: 6px;
          background: var(--canvas-bg);
        }

        .canvas-board {
          position: relative;
          user-select: none;
          font-family: "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace;
          background-image: linear-gradient(to right, color-mix(in srgb, var(--grid-color) 30%, transparent) 1px, transparent 1px),
                           linear-gradient(to bottom, color-mix(in srgb, var(--grid-color) 30%, transparent) 1px, transparent 1px);
          background-position: 0 0;
        }

        .cursor-crosshair { cursor: crosshair; }
        .cursor-text { cursor: text; }
        .cursor-default { cursor: default; }

        .box-element {
          position: absolute;
          border: 2px solid var(--border);
          border-radius: 4px;
        }

        .box-element.selected {
          border-color: var(--accent);
          background-color: var(--selection-bg);
          box-shadow: 0 0 0 1px var(--accent);
          z-index: 10;
        }

        .text-element {
          position: absolute;
          padding: 2px 4px;
          font-size: 12px;
          line-height: 1;
          color: var(--text);
          transform: translateY(1px);
          white-space: pre;
          border-radius: 2px;
        }

        .text-element.selected {
          background: var(--accent);
          color: var(--bg);
          z-index: 10;
        }

        .preview-rect {
          position: absolute;
          border-radius: 4px;
          border: 2px solid;
          pointer-events: none;
        }

        .preview-rect.drawing {
          border-color: var(--accent);
          background: var(--selection-bg);
          border-style: dashed;
        }

        .preview-rect.marquee {
          border-color: var(--accent);
          background: var(--selection-bg);
          opacity: 0.5;
        }

        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--bg);
          border: 1px solid var(--accent);
          border-radius: 2px;
          z-index: 20;
        }

        .resize-handle.nw { top: -5px; left: -5px; cursor: nwse-resize; }
        .resize-handle.ne { top: -5px; right: -5px; cursor: nesw-resize; }
        .resize-handle.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
        .resize-handle.se { bottom: -5px; right: -5px; cursor: nwse-resize; }

        /* Text Input */
        .text-input {
          width: 240px;
          padding: 4px 8px;
          font-family: monospace;
          font-size: 12px;
          color: var(--text);
          background: var(--bg);
          border: 1px solid var(--accent);
          border-radius: 4px;
          outline: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .input-hint {
          margin-top: 4px;
          font-size: 10px;
          color: var(--text-muted);
        }

        /* Sidebar Panels */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }

        .element-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 99px;
          border: 1px solid var(--border);
          font-size: 11px;
          color: var(--accent);
          text-transform: capitalize;
        }

        .selection-count {
          font-size: 11px;
          color: var(--text-muted);
        }

        .empty-state {
          font-size: 0.875rem;
          color: var(--text-muted);
          opacity: 0.6;
        }

        .multi-select-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-main {
          font-size: 0.875rem;
          color: var(--text);
        }

        .info-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .props-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .prop-item {
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.5rem;
          background: var(--bg);
        }

        .prop-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .prop-value {
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--text);
        }

        .props-hint {
          grid-column: span 2;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .text-props {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .edit-text-btn {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-text-btn:hover {
          background: var(--panel-border);
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--panel-border);
        }

        .output-textarea {
          height: 300px;
          width: 100%;
          resize: none;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.75rem;
          font-family: monospace;
          font-size: 12px;
          line-height: 1.2;
          color: var(--text);
          outline: none;
        }

        .output-textarea:focus {
          border-color: var(--accent);
        }

        .output-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .code-font {
          font-family: monospace;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
