import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";

const paginationModel = { page: 0, pageSize: 5 };

interface TableChartProps {
  tableData: Record<string, any>[];
  calculations?: Record<string, (row: Record<string, any>) => string>;
  idName: string;
  height: number;
  widthOfItem: number;
}

const TableChart: React.FC<TableChartProps> = ({
  tableData,
  idName,
  calculations,
  height,
  widthOfItem,
}) => {
  const rows: Record<string, any>[] = tableData.map((row) => {
    return { ...row };
  });

  if (calculations) {
    rows.forEach((row) =>
      Object.entries(calculations).forEach(
        ([calculationName, calculationFunction]) =>
          (row[calculationName] = calculationFunction(row))
      )
    );
  }

  const columnNames: Set<string> = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((item) => columnNames.add(item));
  });

  const columns: GridColDef[] = [...columnNames].map((columnName) => {
    return {
      field: columnName,
      headerName: columnName,
      width: widthOfItem,
      headerClassName: "table-column",
    };
  });

  return (
    <Paper sx={{ height: height, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 67]}
        sx={{
          border: 0,
        }}
        getRowId={(row) => row[idName]}
      />
    </Paper>
  );
};

export default TableChart;
