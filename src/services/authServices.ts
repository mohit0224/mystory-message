import axios from "axios";

class authService {
	checkUniqueUsername = async (username: string | any) =>
		await axios.get(`/api/check-username-unique?username=${username}`);

	signup = async (signupUser: {
		username: string;
		email: string;
		password: string;
	}) => await axios.post("/api/signup", signupUser);

	otpVerify = async (otp: { username: string; code: string }) =>
		await axios.post("/api/verify-otp", otp);
}

const authServices = new authService();
export default authServices;
