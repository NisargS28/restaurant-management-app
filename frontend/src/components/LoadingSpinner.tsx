export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`inline-block animate-spin rounded-full border-blue-500 border-l-transparent border-r-transparent ${sizeClasses[size]} drop-shadow-md`} 
        style={{ animationDuration: '0.8s' }}
      />
    </div>
  );
}
