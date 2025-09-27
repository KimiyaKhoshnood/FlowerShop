"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const ChartRadialBar = ({
  data,
}: {
  data: { name: string; value: number; fill: string }[];
}) => {
  return (
    <div className="flex flex-col items-center">
      <RadialBarChart
        width={150}
        height={75}
        cx={75}
        cy={75}
        innerRadius={60}
        outerRadius={50}
        barSize={10}
        startAngle={180}
        endAngle={0}
        data={data}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar background dataKey="value" angleAxisId={0} />
      </RadialBarChart>
    </div>
  );
};

export default ChartRadialBar;
