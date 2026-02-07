import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cashier Dashboard',
  description: 'Manage products, place orders, and process payments',
};

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
