import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { categoryMeta } from "../utils/constants";

export default function CategoryChart({ data, height = 220 }) {
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Category breakdown chart">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="category"
            type="category"
            width={110}
            tickFormatter={(c) => categoryMeta(c).label}
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9aa8c7" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 12, fontFamily: "monospace", fontSize: 12, color: "#edf2ff" }}
            formatter={(value, _name, item) => [value, categoryMeta(item.payload.category).label]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={categoryMeta(entry.category).color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
