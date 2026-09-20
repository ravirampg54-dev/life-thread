import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ActivityChart({ data, dataKeyX, dataKeyY, color = "#8b5cf6", height = 180 }) {
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Activity distribution chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
          <XAxis dataKey={dataKeyX} tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9aa8c7" }} axisLine={{ stroke: "rgba(148,163,184,0.2)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9aa8c7" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 12, fontFamily: "monospace", fontSize: 12, color: "#edf2ff" }}
          />
          <Area type="monotone" dataKey={dataKeyY} stroke={color} strokeWidth={2} fill="url(#activityFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
