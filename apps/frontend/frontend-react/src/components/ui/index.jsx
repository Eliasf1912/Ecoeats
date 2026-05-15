export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand';
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-5 py-3',
  };
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-white text-ink border border-gray-200 hover:bg-surface',
    danger: 'bg-white text-danger border border-danger hover:bg-danger hover:text-white',
    ghost: 'bg-transparent text-ink hover:bg-surface',
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <input
        className={`w-full rounded-lg border ${error ? 'border-danger' : 'border-gray-200'} bg-white px-3 py-2.5 text-base text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${className}`}
        {...props}
      />
      {error && <span className="block text-sm text-danger mt-1">{error}</span>}
    </label>
  );
}

export function Badge({ variant = 'default', className = '', children }) {
  const variants = {
    default: 'bg-surface text-ink',
    brand: 'bg-brand text-white',
    soft: 'bg-brand-light text-brand-dark',
    danger: 'bg-danger text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Icon({ name, className = 'w-5 h-5' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    className,
  };

  switch (name) {
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.3h7.7a1.5 1.5 0 0 0 1.5-1.2L20 8H6" />
        </svg>
      );
    case 'back':
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M20 4c0 8-6 14-14 14 0-8 6-14 14-14z" />
          <path d="M6 18C10 14 14 10 18 6" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      );
    default:
      return null;
  }
}
