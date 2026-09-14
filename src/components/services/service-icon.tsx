import { Blocks, Code2, Gauge, LayoutTemplate, PencilRuler, PenTool, Search, ShoppingBag, Sparkles, Target, Wrench, type LucideProps } from "lucide-react";

const icons = {
  "layout-template": LayoutTemplate,
  blocks: Blocks,
  "pencil-ruler": PencilRuler,
  target: Target,
  "pen-tool": PenTool,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  search: Search,
  gauge: Gauge,
  wrench: Wrench,
  code: Code2,
} as const;

export type ServiceIconName = keyof typeof icons;
export const serviceIconNames = Object.keys(icons) as ServiceIconName[];

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as ServiceIconName] ?? Code2;
  return <Icon {...props} />;
}
