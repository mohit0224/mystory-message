import axios from "axios";

class messageService {
	// ------------------ check user accept message ----------------
	isAcceptMessages = () => axios.get("/api/accept-messages");

	switchAcceptMessages = (data: { acceptMessage: boolean }) =>
		axios.post("/api/accept-messages", data);

	// ------------------ get all messages ----------------
	getAllMessages = () => axios.get("/api/get-messages");

	// ------------------ send message ----------------
	sendMessage = async (message: { username: string; content: string }) =>
		await axios.post("/api/send-messages", message);

	// ------------------ delete message ----------------
	deleteMessage = (messageID: string) =>
		axios.delete(`/api/delete-message/${messageID}`);
}

const messageServices = new messageService();
export default messageServices;
