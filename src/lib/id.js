let uid = 0;
export const nextId = () => `l${uid++}`;

export function makeLine(kind, content) {
  return { id: nextId(), kind, content };
}
