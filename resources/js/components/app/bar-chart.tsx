export interface ChartPoint {
    label: string;
    value: number;
}

/**
 * Dependency-free SVG bar chart. Exposes the same data as a visually hidden table so
 * screen-reader users get the numbers, not just a picture.
 */
export function BarChart({
    data,
    title,
    valueLabel,
}: {
    data: ChartPoint[];
    title: string;
    valueLabel: string;
}) {
    const width = 560;
    const height = 180;
    const pad = { top: 8, right: 8, bottom: 24, left: 28 };
    const max = Math.max(1, ...data.map((d) => d.value));
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const slot = data.length > 0 ? innerW / data.length : innerW;
    const barW = Math.max(4, slot * 0.6);
    const ticks = [0, Math.ceil(max / 2), max];

    return (
        <figure>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={title}
                className="h-auto w-full"
            >
                {ticks.map((tick) => {
                    const y = pad.top + innerH - (tick / max) * innerH;
                    return (
                        <g key={tick}>
                            <line
                                x1={pad.left}
                                x2={width - pad.right}
                                y1={y}
                                y2={y}
                                stroke="var(--border)"
                                strokeWidth="1"
                            />
                            <text
                                x={pad.left - 6}
                                y={y + 3}
                                textAnchor="end"
                                fontSize="10"
                                fill="var(--muted-foreground)"
                            >
                                {tick}
                            </text>
                        </g>
                    );
                })}
                {data.map((d, i) => {
                    const h = (d.value / max) * innerH;
                    const x = pad.left + i * slot + (slot - barW) / 2;
                    return (
                        <g key={d.label}>
                            <rect
                                x={x}
                                y={pad.top + innerH - h}
                                width={barW}
                                height={h}
                                rx="2"
                                fill="var(--primary)"
                            >
                                <title>{`${d.label}: ${d.value} ${valueLabel}`}</title>
                            </rect>
                            {(data.length <= 8 || i % 2 === 0) && (
                                <text
                                    x={x + barW / 2}
                                    y={height - 8}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="var(--muted-foreground)"
                                >
                                    {d.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <table className="sr-only">
                <caption>{title}</caption>
                <thead>
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">{valueLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.label}>
                            <th scope="row">{d.label}</th>
                            <td>{d.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
