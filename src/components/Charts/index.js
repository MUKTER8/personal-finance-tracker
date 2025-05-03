import React from "react";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  // Filter out duplicate income entries with same date and amount
  const incomeData = sortedTransactions
    .filter((item) => item.type === "income")
    .reduce((unique, item) => {
      const isDuplicate = unique.some(
        (entry) => entry.date === item.date && entry.amount === item.amount
      );
      if (!isDuplicate) {
        unique.push(item);
      }
      return unique;
    }, []);
  console.log("Line Chart Data (incomeData):", incomeData);

  // Professional Line Chart Config
  const lineConfig = {
    data: incomeData,
    autoFit: true,
    height: 400,
    padding: [40, 40, 80, 80],
    xField: "date",
    yField: "amount",
    theme: "light",
    xAxis: {
      label: {
        rotate: -30,
        style: {
          fill: "#6b7280",
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
        },
      },
      line: {
        style: {
          stroke: "#e5e7eb",
          lineWidth: 1,
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#e5e7eb",
            lineWidth: 0.5,
            lineDash: [4, 4],
          },
        },
      },
    },
    yAxis: {
      label: {
        formatter: (value) => `৳${value.toLocaleString()}`,
        style: {
          fill: "#6b7280",
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
        },
      },
      line: {
        style: {
          stroke: "#e5e7eb",
          lineWidth: 1,
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#e5e7eb",
            lineWidth: 0.5,
            lineDash: [4, 4],
          },
        },
      },
    },
    lineStyle: {
      stroke: "#3b82f6",
      lineWidth: 3,
      shadowColor: "#3b82f6",
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    },
    point: {
      size: 6,
      shape: "diamond",
      style: {
        fill: "#ffffff",
        stroke: "#3b82f6",
        lineWidth: 2,
      },
    },
    areaStyle: {
      fill: "l(270) 0:#3b82f610 1:#3b82f600",
    },
    interactions: [{ type: "marker-active" }, { type: "brush" }],
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1500,
        easing: "easeOutQuart",
      },
      update: {
        animation: "path-in",
        duration: 800,
      },
    },
  };

  // Pie Chart Config (For Expenses)
  let expenseData = sortedTransactions.filter(
    (item) => item.type === "expense"
  );

  let totalExpense = expenseData.reduce((sum, item) => sum + item?.amount, 0);
  expenseData = expenseData.map((item) => ({
    ...item,
    percentage: `${((item?.amount / totalExpense) * 100).toFixed(2)}%`,
  }));

  const pieConfig = {
    appendPadding: [20, 10, 10, 10], // [top, right, bottom, left]
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
      formatter: (data) => {
        return {
          name: data.tag,
          value: `৳${data.amount.toLocaleString()} (${(
            (data.amount / totalExpense) *
            100
          ).toFixed(2)}%)`,
        };
      },
    },
    interactions: {
      type: "element-active",
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: 16,
          fontWeight: 500,
          color: "#4b5563",
        },
        content: "Expenses by Category",
      },
    },
  };

  return (
    <div
      className="financial-dashboard"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="analytics-section">
        <div className="chart-header" style={{ marginBottom: 24 }}>
          <h2
            className="section-title"
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#111827",
              margin: 0,
            }}
          >
            Financial Analytics Dashboard
          </h2>
        </div>
        <div
          className="charts-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            className="line-chart"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Income Trend
              </h3>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                }}
              >
                {incomeData.length} income data
              </div>
            </div>
            <Line {...lineConfig} />
          </div>
          <div
            className="pie-chart"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              Expense Chart
            </h3>
            <Pie {...pieConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
