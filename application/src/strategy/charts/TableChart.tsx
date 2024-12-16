import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React from "react";

const paginationModel = { page: 0, pageSize: 5 };

interface TableChartProps {
  matches: Record<string, string>[];
  calculations?: Record<string, (match: Record<string, string>) => string>;
  idName: string;
  height: number;
  widthOfItem: number;
}

const TableChart: React.FC<TableChartProps> = ({
  matches,
  idName,
  calculations,
  height,
  widthOfItem,
}) => {
  const matchesData: Record<string, string>[] = matches.map((match) => {
    return { ...match };
  });

  if (calculations) {
    matchesData.forEach((match) =>
      Object.entries(calculations).forEach(
        ([calculationName, calculationFunction]) =>
          (match[calculationName] = calculationFunction(match))
      )
    );
  }

  const columnNames: Set<string> = new Set<string>();
  matchesData.forEach((match) => {
    Object.keys(match).forEach((item) => columnNames.add(item));
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
        rows={matchesData}
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
