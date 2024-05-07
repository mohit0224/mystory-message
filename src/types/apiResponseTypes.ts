import { MessageType } from "./modelsTypes";

export interface ApiResponse {
	message: string;
	success: boolean;
	isAcceptedMessages?: boolean;
	messages?: Array<MessageType>;
}
