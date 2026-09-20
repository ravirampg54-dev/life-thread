import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ActivityChart({ data, dataKeyX, dataKeyY, color = "#c1502e", height = 180 }) {
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Activity distribution chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,10,8,0.08)" vertical={false} />
          <XAxis dataKey={dataKeyX} tick={{ fontSize: 11, fontFamily: "monospace" }} axisLine={{ stroke: "rgba(11,10,8,0.2)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#faf6ec", border: "1px solid #0b0a08", borderRadius: 4, fontFamily: "monospace", fontSize: 12 }}
          />
          <Area type="monotone" dataKey={dataKeyY} stroke={color} strokeWidth={2} fill="url(#activityFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
