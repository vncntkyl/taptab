import { useFunction } from "../context/Functions";

export const PlayerCategoryLabel = ({ payload, x, y }) => {
  const { capitalize } = useFunction();
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={5} fill="#666" textAnchor="end">
        {capitalize(payload.value)}
      </text>
    </g>
  );
};