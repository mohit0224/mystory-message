"use client";

import { User } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const Header = () => {
	const { data: session } = useSession();
	const user: User = session?.user as User;
	return (
		<nav className=" w-screen px-8 xl:px-10 fixed top-0 left-0 bg-white">
			{/* web header */}
			<div className="h-16 hidden sm:flex items-center justify-between">
				<Link
					className="text-xl font-semibold"
					href={session ? "/dashboard" : "/"}
				>
					Mystry Message
				</Link>
				<div>
					{session ? (
						<>
							<ul className="flex items-center gap-5">
								<li className="text-lg capitalize font-semibold">
									{user?.username} ,
								</li>
								<li>
									<Link href={"/dashboard"}>Dahboard</Link>
								</li>
								<li>
									<Button variant={"secondary"} onClick={() => signOut()}>
										Signout
									</Button>
								</li>
							</ul>
						</>
					) : (
						<>
							<ul className="flex items-center gap-5">
								<li>
									<Link href={"/signup"}>signup</Link>
								</li>
								<li>
									<Link href={"/signin"}>signin</Link>
								</li>
							</ul>
						</>
					)}
				</div>
			</div>

			{/* mobile header */}
			<div className="h-16 flex sm:hidden items-center justify-between">
				<Link
					className="text-xl font-semibold"
					href={session ? "/dashboard" : "/"}
				>
					Mystry Message
				</Link>
				<div>
					{session ? (
						<>
							<ul className="flex items-center gap-5">
								<li className="text-lg capitalize font-semibold">
									{user?.username} ,
								</li>
								<li>
									<Button variant={"secondary"} onClick={() => signOut()}>
										Signout
									</Button>
								</li>
							</ul>
						</>
					) : (
						<>
							<ul className="flex items-center gap-5">
								<li>
									<Link href={"/signup"}>signup</Link>
								</li>
								<li>
									<Link href={"/signin"}>signin</Link>
								</li>
							</ul>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Header;
