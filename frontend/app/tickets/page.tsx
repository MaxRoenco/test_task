import { fetchTicketsPagination } from "@/lib/api";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { validateSorting } from "@/lib/tools/validators";

const ITEMS_PER_PAGE = 7;
const SORTABLE_FIELDS : string[] = ["subject", "bugType", "statusBug", "priority", "createdAt", "updatedAt"] as const;

type SearchParams = {
    sort?: string;
    page?: string;
};

export default async function TicketsTable({ searchParams }: { searchParams?: SearchParams }) {
    const sort = validateSorting(searchParams?.sort, SORTABLE_FIELDS, "bugType:desc");
    const page = Math.max(1, Number(searchParams?.page) || 1);

    const data = await fetchTicketsPagination(page, sort, ITEMS_PER_PAGE);
    const { pageCount: totalPages } = data.meta.pagination;

    const adjustedPage = Math.min(Math.max(page, 1), totalPages);
    const adjustedData = adjustedPage !== page 
        ? await fetchTicketsPagination(adjustedPage, sort, ITEMS_PER_PAGE)
        : data;

    const canNextPage = adjustedPage < totalPages;
    const canPrevPage = adjustedPage > 1;

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={adjustedData.data}
                canNextPage={canNextPage}
                canPrevPage={canPrevPage}
                totalPages={totalPages}
                pageNumber={adjustedPage}
                sort={sort}
            />
        </div>
    );
}