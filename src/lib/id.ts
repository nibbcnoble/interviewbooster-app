let uid = 0;

export const nextId = (): string => `l${uid++}`;

export interface Line<TContent = unknown> {
  id: string;
  kind: string;
  content: TContent;
}

export function makeLine<TContent = unknown>(
  kind: string,
  content: TContent
): Line<TContent> {
  return { id: nextId(), kind, content };
}
