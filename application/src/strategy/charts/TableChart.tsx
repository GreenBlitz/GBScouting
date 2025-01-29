import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridTreeNode,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import React from "react";

const paginationModel = { page: 0, pageSize: 5 };

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface TableChartProps {
  tableData: Record<string, any>[];
  calculations?: Record<string, (row: Record<string, any>) => string>;

  idName: string;
  height: number;
  widthOfItem: number;
  getCellClassName?: (
    params: GridCellParams<any, any, any, GridTreeNode>
  ) => string;
}

const TableChart: React.FC<TableChartProps> = ({
  tableData,
  idName,
  calculations,
  height,
  widthOfItem,
  getCellClassName,
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 67]}
        sx={{
          border: 2,
        }}
        getRowId={(row) => row[idName]}
        getCellClassName={getCellClassName}
      />
    </ThemeProvider>
  );
};

export default TableChart;
