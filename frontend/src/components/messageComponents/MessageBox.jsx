import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import {
	setChatDetailsBox,
	setMessageLoading,
} from "../../redux/slices/conditionSlice";
import { useDispatch, useSelector } from "react-redux";
import AllMessages from "./AllMessages";
import MessageSend from "./MessageSend";
import { addAllMessages } from "../../redux/slices/messageSlice";
import MessageLoading from "../loading/MessageLoading";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import getChatName, { getChatImage } from "../../utils/getChatName";
import ChatDetailsBox from "../chatDetails/ChatDetailsBox";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

// Dropdown menu component for chat options
const ChatMenu = ({ onClose }) => (
	<motion.div
		initial={{ opacity: 0, y: -10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: -10 }}
		className="absolute right-4 top-16 bg-slate-800 text-white rounded-xl shadow-lg z-50 border border-slate-600 overflow-hidden"
	>
		<ul className="text-sm font-medium">
			<li
				className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
				onClick={onClose}
			>
				View Info
			</li>
			<li
				className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
				onClick={onClose}
			>
				Clear Chat
			</li>
			<li
				className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-red-400"
				onClick={onClose}
			>
				Leave Group
			</li>
		</ul>
	</motion.div>
);

const MessageBox = ({ chatId }) => {
	const dispatch = useDispatch();
	const chatDetailsBox = useRef(null);

	const [isExiting, setIsExiting] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [status, setStatus] = useState("online"); // or 'typing' / 'offline'

	const isChatDetailsBox = useSelector(
		(store) => store?.condition?.isChatDetailsBox
	);
	const isMessageLoading = useSelector(
		(store) => store?.condition?.isMessageLoading
	);
	const allMessage = useSelector((store) => store?.message?.message);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const authUserId = useSelector((store) => store?.auth?._id);

	useEffect(() => {
		const getMessage = (chatId) => {
			dispatch(setMessageLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addAllMessages(json?.data || []));
					dispatch(setMessageLoading(false));
					socket.emit("join chat", selectedChat._id);
				})
				.catch((err) => {
					console.error(err);
					dispatch(setMessageLoading(false));
					toast.error("Message Loading Failed");
				});
		};
		getMessage(chatId);
	}, [chatId]);

	// Close details box on outside click
	const handleClickOutside = (event) => {
		if (
			chatDetailsBox.current &&
			!chatDetailsBox.current.contains(event.target)
		) {
			setIsExiting(true);
			setTimeout(() => {
				dispatch(setChatDetailsBox(false));
				setIsExiting(false);
			}, 300);
		}
	};

	useEffect(() => {
		if (isChatDetailsBox) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isChatDetailsBox]);

	return (
		<div className="relative flex flex-col h-full">
			{/* Chat Header */}
			<motion.div
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="py-4 sm:px-6 px-3 w-full h-[8vh] font-semibold flex justify-between items-center 
				 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 backdrop-blur-md 
				 text-white shadow-md border-b border-slate-700"
			>
				<div
					className="flex items-center gap-3 cursor-pointer"
					onClick={() => dispatch(setChatDetailsBox(true))}
				>
					<div
						onClick={(e) => {
							e.stopPropagation();
							dispatch(addSelectedChat(null));
						}}
						className="sm:hidden bg-black/20 hover:bg-black/50 h-8 w-8 rounded-md flex items-center justify-center"
					>
						<FaArrowLeft title="Back" fontSize={14} />
					</div>
					<img
						src={getChatImage(selectedChat, authUserId)}
						alt=""
						className="h-9 w-9 rounded-full object-cover border border-slate-600"
					/>
					<div className="flex flex-col">
						<h1 className="line-clamp-1 font-semibold">
							{getChatName(selectedChat, authUserId)}
						</h1>
						<span className="text-xs text-green-400">
							{status === "typing"
								? "typing..."
								: status === "online"
								? "online"
								: "last seen recently"}
						</span>
					</div>
				</div>
				<div className="relative">
					<CiMenuKebab
						fontSize={20}
						title="Menu"
						className="cursor-pointer hover:text-green-300"
						onClick={() => setShowMenu(!showMenu)}
					/>
					<AnimatePresence>
						{showMenu && <ChatMenu onClose={() => setShowMenu(false)} />}
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Chat Detail Box (slide in) */}
			<AnimatePresence>
				{isChatDetailsBox && (
					<motion.div
						initial={{ x: -400, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -400, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="absolute top-0 left-0 z-30 h-full w-full max-w-96"
					>
						<div
							ref={chatDetailsBox}
							className="border border-slate-600 bg-slate-900 rounded-lg overflow-hidden shadow-xl"
						>
							<ChatDetailsBox />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* All Messages or Loader */}
			<div className="flex-grow overflow-hidden">
				{isMessageLoading ? (
					<MessageLoading />
				) : (
					<AllMessages allMessage={allMessage} />
				)}
			</div>

			{/* Message Input */}
			<MessageSend chatId={chatId} />
		</div>
	);
};

export default MessageBox;
