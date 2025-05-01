import React from "react";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  console.log(sortedTransactions);

  const incomeData = sortedTransactions.filter(
    (item) => item.type === "income"
  );

  // Line Chart Config - income data
  const lineConfig = {
    data: incomeData,
    autoFit: true,
    height: 400,
    padding: [20, 20, 60, 60],
    xField: "date",
    yField: "amount",
    xAxis: {
      type: "cat",
      label: {
        rotate: -30,
        style: {
          fill: "#6b7280",
          fontSize: 12,
        },
      },
      grid: {
        visible: true, // important to show
        line: {
          style: {
            stroke: "#6b7280",
            lineWidth: 2,
          },
        },
      },
      scrollbar: {
        type: "horizontal",
      },
    },
    yAxis: {
      label: {
        formatter: (value) => `৳${value}`,
        style: {
          fill: "#6b7280",
          fontSize: 12,
        },
      },
      grid: {
        visible: true, // important to show
        line: {
          style: {
            stroke: "#6b7280",
            lineWidth: 2,
          },
        },
      },
    },
    lineStyle: {
      stroke: "#4f46e5",
      lineWidth: 4,
    },
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "#ffffff",
        stroke: "#4f46e5",
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
      title: "Date",
      formatter: (datum) => ({
        name: "Amount",
        value: `৳${datum.amount.toLocaleString()}`,
      }),
    },
    interactions: [{ type: "marker-active" }],
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1500,
      },
    },
  };

  // Pie Chart Config (For Expenses)
  let expenseData = sortedTransactions.filter(
    (item) => item.type === "expense"
  );

  // calculate expense and percentage
  let totalExpense = expenseData.reduce((sum, item) => sum + item?.amount, 0);
  expenseData = expenseData.map((item) => ({
    ...item,
    percentage: `${((item?.amount / totalExpense) * 100).toFixed(2)}%`,
  }));

  console.log(expenseData);

  const pieConfig = {
    appendPadding: 10,
    data: expenseData,
    angleField: "amount",
    colorField: "tag",
    radius: 0.75,
    label: {
      text: "percentage",
      style: {
        fontSize: 12,
        fill: "#fff",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      },
      autoRotate: false,
    },
    legend: {
      color: {
        title: false,
        position: "top",
      },
    },
    tooltip: {
      title: "tag",
      items: ["amount"],
      render: (event, { title, items }) => {
        console.log(items, title);
        return (
          <div>
            <b>{title}</b>: {items}
          </div>
        );
      },
    },
    interactions: {
      type: "marker-active",
      tooltip: true,
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: 16,
        },
        content: "Expenses by Category",
      },
    },
  };

  return (
    <div className="financial-dashboard">
      <div className="analytics-section">
        <div className="chart-header">
          <h2 className="section-title">Financial Analytics</h2>
        </div>
        <div className="charts-wrapper">
          <div className="line-chart">
            <Line {...lineConfig} />
          </div>
          <div className="pie-chart">
            <Pie {...pieConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
