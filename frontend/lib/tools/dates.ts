export function toDMY(dateString : string) {
    let date : Date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

export function toDM(dateString : string) {
    let date : Date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
}

export function toAMPM(dateString : string) {
    let date : Date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}