"use client";

import Container from "@/components/Container";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import messageServices from "@/services/messagesServices";
import { MessageType } from "@/types/modelsTypes";
import acceptMessageValidationSchema from "@/validationSchema/acceptMessageValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
	const [message, setMessage] = useState<MessageType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitching, setIsSwitching] = useState(false);
	const [baseURL, setBaseURl] = useState("");

	const { data: session } = useSession();

	const form = useForm({
		resolver: zodResolver(acceptMessageValidationSchema),
	});

	const { watch, setValue, register } = form;
	const acceptMessages = watch("acceptMessages");

	// -------------- delete messages -------------------

	const handleDeleteMessage = (messageID: string) => {
		setMessage(message.filter((item) => item._id !== messageID));
	};

	// -------------- user accepting messages ----------------

	const isAcceptingMessages = useCallback(async () => {
		setIsLoading(true);

		try {
			const get = await messageServices.isAcceptMessages();
			setValue("acceptMessages", get.data.data);
		} catch (err: any) {
			console.log(err.response.data.message);
		} finally {
			setIsLoading(false);
		}
	}, [setValue]);

	// -------------- get all messages ----------------

	const fetchMessages = useCallback(async () => {
		setIsLoading(true);
		setIsSwitching(true);
		try {
			const get = await messageServices.getAllMessages();
			setMessage(get.data.data);
		} catch (err: any) {
			if (err.response?.data.message === "You have no message yet !") return;
			toast.error(err.response?.data.message);
		} finally {
			setIsLoading(false);
			setIsSwitching(false);
		}
	}, [setIsLoading, setMessage]);

	// -------------- useeffect ----------------

	useEffect(() => {
		if (!session || !session.user) return;
		fetchMessages();
		isAcceptingMessages();
		setBaseURl(`${window.location.protocol}//${window.location.host}`);
	}, [session, setValue, isAcceptingMessages, fetchMessages, setMessage]);

	// -------------- user switch accepting messages ----------------

	const switchAcceptingMessages = async () => {
		try {
			const res = await messageServices.switchAcceptMessages({
				acceptMessage: !acceptMessages,
			});
			setValue("acceptMessages", !acceptMessages);
		} catch (err: any) {
			console.log(err);
		}
	};

	const { username } = (session?.user as User) || {};

	const profileURL = `${baseURL}/anonymous-link/${username}`;

	// ----------- copy unique link -----------
	const copyToClipboard = () => {
		window.navigator.clipboard.writeText(profileURL);
		toast.message("link copied !!", {
			description: profileURL,
		});
	};

	if (!session) {
		return (
			<>
				<Container>
					<p className="text-3xl font-bold mb-5">Login please</p>
					<p className="text-lg">
						<Link href={"/signin"}>
							<Button variant={"outline"}>Click here</Button>{" "}
						</Link>{" "}
						to login.
					</p>
				</Container>
			</>
		);
	}

	return (
		<>
			<Container>
				<section className="space-y-5">
					<div className="flex gap-2">
						<h1 className="text-3xl font-bold">Welcome, {username}</h1>
						<div
							className={`w-3 h-3 rounded-full transition-transform duration-[2000] animate-pulse
							${acceptMessages ? "bg-green-500" : "bg-slate-100"} `}
						></div>
					</div>

					<div className=" space-y-2">
						<p className="text-lg font-semibold">Copy your unique link</p>
						<div className="relative">
							<input
								className="w-full px-5 py-3 outline-none border rounded-lg bg-transparent"
								disabled
								value={profileURL}
							/>
							<Button
								variant={"secondary"}
								className=" absolute top-1/2 -translate-y-1/2 right-1.5 tracking-normal "
								onClick={() => copyToClipboard()}
							>
								Copy
							</Button>
						</div>
					</div>

					<div className="flex gap-10 items-center">
						<div className="space-y-2">
							<p className="text-lg font-semibold">Accept messages</p>
							<div className="flex items-center gap-2">
								<Switch
									{...register("acceptMessages")}
									checked={acceptMessages}
									onCheckedChange={switchAcceptingMessages}
									disabled={isSwitching}
								/>
								<span className=""> {acceptMessages ? "On" : "Off"} </span>
							</div>
						</div>

						<div>
							<Button variant={"outline"} onClick={() => fetchMessages()}>
								{isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<RefreshCcw className="w-4 h-4" />
								)}
							</Button>
						</div>
					</div>

					<div className="px-3">
						<div className="bg-gray-100 h-0.5 rounded-full"></div>
					</div>

					<div className="flex gap-5 flex-wrap justify-center">
						{isLoading ? (
							<div>
								<p className="text-lg">Loading...</p>
							</div>
						) : message.length > 0 ? (
							message.map((item) => (
								<MessageCard
									key={item._id}
									messageData={item}
									messageDelete={handleDeleteMessage}
								/>
							))
						) : (
							<div>No message for display !!</div>
						)}
					</div>
				</section>
			</Container>
		</>
	);
};

export default Dashboard;
