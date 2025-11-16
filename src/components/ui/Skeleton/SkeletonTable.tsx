import './Skeleton.scss';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function SkeletonTable({ rows = 5, columns = 6, className = '' }: SkeletonTableProps) {
  return (
    <div className={`skeleton-table ${className}`}>
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton-line"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-line"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

