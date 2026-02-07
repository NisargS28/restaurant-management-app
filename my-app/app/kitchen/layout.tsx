import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kitchen Display',
  description: 'View and manage incoming orders',
};

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
