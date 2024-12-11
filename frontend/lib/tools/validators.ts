export function validateSorting(sort : string | undefined, options: string[], defaultSort : string) {
    return sort && options.some(e => sort === `${e}:asc` || sort === `${e}:desc`) ? sort : defaultSort;
}