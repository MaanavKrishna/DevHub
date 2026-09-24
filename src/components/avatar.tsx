import Image from "next/image";

export function Avatar({
  src,
  name,
  size = 56,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  return src ? (
    <Image
      className="avatar"
      src={src}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      unoptimized
    />
  ) : (
    <span
      className="avatar avatar-fallback"
      style={{ width: size, height: size }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
