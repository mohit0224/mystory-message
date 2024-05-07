import dbConnect from "@/database/dbConnect";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
				try {
					const user = await User.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});
					if (!user) throw new Error("User not found !!");
					if (!user.isVerified)
						throw new Error("Verify your account before login !!");

					const checkPassword = await bcryptjs.compare(
						credentials.password,
						user.password
					);
					if (checkPassword) {
						return user;
					} else throw new Error("Invalid password !!");
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.username = user.username;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.username = token.username;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET_KEY,
	pages: {
		signIn: "/signin",
	},
};
