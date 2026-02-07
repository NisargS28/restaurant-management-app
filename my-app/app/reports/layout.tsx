import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Reports',
  description: 'View daily sales, item-wise sales, and payment summaries',
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
