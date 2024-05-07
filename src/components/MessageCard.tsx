import { MessageType } from "@/types/modelsTypes";
import { X } from "lucide-react";
import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import messageServices from "@/services/messagesServices";
import { toast } from "sonner";
import dayjs from "dayjs";

type MessageCardProps = {
	messageData: MessageType;
	messageDelete: (messageID: string) => void;
};
const MessageCard = ({ messageData, messageDelete }: MessageCardProps) => {
	const handleDeleteMessage = (messageID: string) => {
		messageDelete(messageID);

		const response = messageServices.deleteMessage(messageID);
		toast.promise(response, {
			loading: "Deleting...",
			success: (res) => res.data.message,
			error: (err) => err.response.data.message,
		});
	};

	return (
		<>
			<div className="border p-5 w-96 rounded-lg relative">
				<div className="absolute top-2 right-2">
					<AlertDialog>
						<AlertDialogTrigger>
							<div className="bg-red-200 p-0.5 rounded-full cursor-pointer">
								<X className="w-4 h-4 text-red-500 " />
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleDeleteMessage(messageData._id)}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<p>{messageData.content}</p>
				<p className="text-sm text-slate-400">
					{dayjs(messageData?.createdAt).format("MMM D, YYYY  h:mm A")}
				</p>
			</div>
		</>
	);
};

export default MessageCard;
