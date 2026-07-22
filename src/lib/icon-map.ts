import {
  Sparkles,
  ScanLine,
  Shield,
  Droplet,
  Gem,
  Activity,
  Sun,
  AlignCenter,
  Settings,
  Scissors,
  Smile,
  Zap,
  CalendarCheck,
  ShieldCheck,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  scan: ScanLine,
  shield: Shield,
  droplet: Droplet,
  gem: Gem,
  activity: Activity,
  sun: Sun,
  "align-center": AlignCenter,
  settings: Settings,
  scissors: Scissors,
  smile: Smile,
  zap: Zap,
  "calendar-check": CalendarCheck,
  "shield-check": ShieldCheck,
  "heart-handshake": HeartHandshake,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Sparkles;
}
