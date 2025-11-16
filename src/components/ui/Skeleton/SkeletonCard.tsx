import './Skeleton.scss';

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'dashboard' | 'centered';
}

export default function SkeletonCard({ className = '', variant = 'default' }: SkeletonCardProps) {
  if (variant === 'dashboard') {
    return (
      <div className={`card border-gold card-hover ${className}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="skeleton-shimmer" style={{ flex: 1 }}>
              <div className="skeleton-line skeleton-title" style={{ width: '60%', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-line skeleton-subtitle" style={{ width: '40%' }}></div>
            </div>
            <div className="skeleton-icon" style={{ width: '28px', height: '28px', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className={`card border-gold card-hover ${className}`}>
        <div className="card-body text-center">
          <div className="skeleton-shimmer">
            <div className="skeleton-line skeleton-title" style={{ width: '70%', margin: '0 auto 0.5rem' }}></div>
            <div className="skeleton-line skeleton-subtitle" style={{ width: '50%', margin: '0 auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-shimmer">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </div>
    </div>
  );
}

