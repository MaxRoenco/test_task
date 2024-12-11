import localFont from "next/font/local";

export const geistSans = localFont({
    src: "./fontFiles/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
export const geistMono = localFont({
    src: "./fontFiles/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});