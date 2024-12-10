import Ticket from "./Ticket";
import Pagination from "./Pagination";

export default interface Data {
    data: Ticket[],
    meta: {pagination: Pagination},
}
