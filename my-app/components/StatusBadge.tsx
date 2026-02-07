import { OrderStatus } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  large?: boolean;
}

export default function StatusBadge({ status, large = false }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${getStatusColor(status)}
        ${large ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm'}
      `}
    >
      {status}
    </span>
  );
}
