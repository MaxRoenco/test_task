"use client"
import { Bug, columns } from "./columns"
import { DataTable } from "./data-table"
import { useState, useEffect, useCallback } from "react";

export default function DemoPage() {
  const [bugReports, setBugReports] = useState<Bug[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBugReports = useCallback(async () => {
      try {
          const response = await fetch('http://localhost:1337/api/bug-reports?populate=*');

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setBugReports(data.data);
          console.log(data);
      } catch (err) {
          if (err instanceof Error) {
              setError(err.message);
          } else {
              setError('An unexpected error occurred.');
          }
      }
  }, []);

  useEffect(() => {
      fetchBugReports();
  }, [fetchBugReports])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={bugReports} />
    </div>
  )
}
