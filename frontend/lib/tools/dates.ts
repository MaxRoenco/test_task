export function toDMY(dateString : string) {
    const date : Date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

export function toDM(dateString : string) {
    const date : Date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
}

export function toAMPM(dateString : string) {
    const date : Date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}