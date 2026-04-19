import React, { useState } from 'react';

/**
 * LazyImage — loads with a skeleton shimmer, fades in on load, hides on error.
 * Eliminates the blank/broken "loading" flash for remote images.
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  style,
  width,
  height,
  onError: onErrorProp,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  if (error) return null;

  return (
    <div className="relative w-full h-full" style={style}>
      {/* Skeleton shimmer — visible until image loads */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-slate-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          onErrorProp?.();
        }}
      />
    </div>
  );
}

/**
 * CandidateAvatar — circular candidate image with initials fallback.
 * SVG candidates load instantly; this handles fallback gracefully.
 */
export function CandidateAvatar({ src, name, size = 36, className = '' }) {
  const [error, setError] = useState(false);
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (error || !src) {
    return (
      <div
        className={`rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <span className="text-slate-500 font-semibold" style={{ fontSize: size * 0.35 }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
}
