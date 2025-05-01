import { Table, Select, Input, Button, Upload, message, Space } from "antd";
import React, { useState, useMemo } from "react";
import {
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./styles.css";

const { Option } = Select;

function TransactionsTable({ transactions, onImport, refreshData }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  // Columns definition with built-in sorter
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sort by Name
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount, // Sort by Amount
      render: (amount) => `৳ ${amount.toFixed(2)}`,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      // Sort by Tag (optional, can be removed if not needed)
      sorter: (a, b) => a.tag.localeCompare(b.tag),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className={type === "income" ? "income-text" : "expense-text"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ),
      // Sort by Type (optional, can be removed if not needed)
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // Sort by Date
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
  ];

  // Filtered transactions with search and type filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === "" || item.type === typeFilter)
    );
  }, [transactions, search, typeFilter]);

  // Export to CSV function
  const exportToCSV = () => {
    const csvData = [
      ["Name", "Amount", "Tag", "Type", "Date"],
      ...filteredTransactions.map((tx) => [
        tx.name,
        tx.amount.toFixed(2),
        tx.tag,
        tx.type,
        moment(tx.date).format("YYYY-MM-DD"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Import CSV file
  const handleImport = (file) => {
    setImportLoading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const importedData = lines
          .slice(1)
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const values = line.split(",");
            const entry = {};
            headers.forEach((header, index) => {
              entry[header] = values[index] ? values[index].trim() : "";
            });
            return entry;
          })
          .filter((row) => row.name && row.amount)
          .map((row) => ({
            name: row.name,
            amount: parseFloat(row.amount.toString().replace(/[^0-9.-]+/g, "")),
            tag: row.tag || "",
            type: row.type ? row.type.toLowerCase() : "expense",
            date: row.date || moment().format("YYYY-MM-DD"),
          }));

        if (importedData.length > 0) {
          await onImport(importedData);
          await refreshData();
          message.success(`Imported ${importedData.length} transactions`);
        } else {
          message.warning("No valid transactions found");
        }
      } catch (error) {
        message.error("Error processing CSV file");
        console.error("Import error:", error);
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
    return false;
  };

  // Upload Props for CSV file
  const uploadProps = {
    beforeUpload: handleImport,
    accept: ".csv",
    showUploadList: false,
  };

  return (
    <div className="transactions-table">
      <div
        className="filters"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            allowClear
            style={{ width: 1200 }}
          />
          <Select
            style={{ width: 200 }}
            onChange={setTypeFilter}
            value={typeFilter}
            placeholder="Filter by Type"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Space>

        <Space>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={importLoading}>
              Import
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToCSV}
          >
            Export
          </Button>
        </Space>
      </div>
      <h4 style={{ marginBottom: 10 }}>My Transaction</h4>

      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: true }}
        loading={importLoading}
        locale={{ emptyText: "No transactions available" }}
      />
    </div>
  );
}

export default TransactionsTable;
