import brand from "@/content/brand.json";

/** Approved Rhythm geometry, shared with the generated brand and product assets. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false">
      <g transform="translate(100 100) rotate(-45)">
        <path d={brand.curve} />
        <path d={brand.curve} transform="rotate(180)" />
        <rect x={brand.diamond.x} y={brand.diamond.y} width={brand.diamond.size} height={brand.diamond.size} rx={brand.diamond.radius} />
      </g>
    </svg>
  );
}
