import React from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./chart.module.scss";
import { useSocket } from "@/context/SocketContext";

interface PayloadItem {
  payload: {
    collection: string;
  };
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload: PayloadItem[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltip__list}>
          <p>{payload[0].payload.collection}</p>
          <span>{payload[0].value}</span>
        </div>
      </div>
    );
  }
};

const SimplePieCart = () => {
  const socket = useSocket();

  if (socket?.loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.rounded}></div>
      </div>
    );
  }
  if (socket?.reveneuData && socket?.bestCollection.length === 0) {
    <div
      style={{
        width: "100%",
        height: "250px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <p>Belum ada data</p>
    </div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250} style={{ margin: "auto" }}>
      <PieChart width={300} height={300} accessibilityLayer={false}>
        <Pie
          data={socket?.bestCollection || []}
          dataKey="total"
          nameKey="collection"
        />
        <Legend
          wrapperStyle={{ fontSize: "0.75rem", textTransform: "capitalize" }}
        />
        <Tooltip content={<CustomTooltip active={false} payload={[]} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SimplePieCart;
