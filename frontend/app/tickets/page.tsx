
import { fetchTicketsPagination } from "@/lib/api";
import Data from "@/lib/types/Data";
import { columns } from "./columns"
import { DataTable } from "./data-table"

const ITEMS_PER_PAGE = 7;



export default async function TicketsTable(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {

    const searchParams = await props.searchParams;

    let currentPage : number = Number(searchParams?.page) || 1;
    let data: Data = await fetchTicketsPagination(currentPage, ITEMS_PER_PAGE);

    const totalPages = data.meta.pagination.pageCount;

    
    if(currentPage > totalPages) {
        currentPage = totalPages;
        data = await fetchTicketsPagination(currentPage, ITEMS_PER_PAGE);
    } else if(currentPage < 1) {
        currentPage = 1;
    }

    const canNextPage : boolean = currentPage < totalPages;
    const canPrevPage : boolean = currentPage > 1;



    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={data.data}
                canNextPage={canNextPage}
                canPrevPage={canPrevPage}
                totalPages={totalPages}
                pageNumber={currentPage}
            />
        </div>
    )
}