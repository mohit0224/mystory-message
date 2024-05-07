import Header from "@/components/header/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mystory Messages | Dashboard",
	description: "Send annonymous messages",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
}
