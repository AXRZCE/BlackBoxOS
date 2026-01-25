import { AppShell } from '@/components/shell/AppShell';

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

