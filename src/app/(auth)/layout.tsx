import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mystory Messages | Authentication",
	description: "Send annonymous messages",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
