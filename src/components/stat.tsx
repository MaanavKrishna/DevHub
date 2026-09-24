export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="stat">
      <strong>
        {typeof value === "number"
          ? new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(value)
          : value}
      </strong>
      <span>{label}</span>
      {detail && <small>{detail}</small>}
    </div>
  );
}
