type DefaultUserAvatarProps = {
  className?: string;
  src?: string | null;
  alt?: string;
};

export function DefaultUserAvatar({
  className = "flex h-10 w-10 items-center justify-center rounded-full bg-slate-100",
  src,
  alt = "",
}: DefaultUserAvatarProps) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div aria-hidden className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-slate-500"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}
