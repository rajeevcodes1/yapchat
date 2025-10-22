import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	// Fetch Auth User ------------------------------------------------------
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};

	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	// Scroll and redirect logic --------------------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	// Logout ---------------------------------------------------------------
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	// Hide header on scroll ------------------------------------------------
	useEffect(() => {
		let prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			let currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Header Menu logic ---------------------------------------------------
	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	useEffect(() => {
		if (isHeaderMenu)
			document.addEventListener("mousedown", handleClickOutside);
		else document.removeEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isHeaderMenu]);

	// ---------------------------------------------------------------------
	return (
		<header
			id="header"
			className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 px-5 md:px-10 
            flex justify-between items-center 
            bg-[#0f0f0f]/95 backdrop-blur-md text-gray-200 
            shadow-md shadow-black/40 border-b border-gray-800 transition-all duration-300"
		>
			{/* Logo + Title */}
			<div className="flex items-center gap-3">
				<Link to="/">
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-full border border-gray-700 hover:shadow-blue-500/40 transition-all duration-300"
					/>
				</Link>
				<Link to="/">
					<span className="text-lg md:text-xl font-semibold text-white hover:text-blue-400 transition-colors">
						YapChat
					</span>
				</Link>
			</div>

			{/* User Section */}
			{user ? (
				<div className="flex items-center space-x-3">
					{/* Notification Icon */}
					<span
						className={`relative cursor-pointer ${
							newMessageRecieved.length > 0
								? "animate-pulse text-blue-400"
								: ""
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={25} />
						{newMessageRecieved.length > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
								{newMessageRecieved.length}
							</span>
						)}
					</span>

					{/* Username */}
					<span className="hidden sm:inline text-sm font-medium">
						Hi, {user.firstName}
					</span>

					{/* User Avatar */}
					<div
						ref={headerUserBox}
						onClick={() => dispatch(setHeaderMenu(!isHeaderMenu))}
						className="flex items-center border border-gray-600 bg-[#1a1a1a] rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
					>
						<img
							src={user.image}
							alt="user"
							className="w-10 h-10 object-cover rounded-full"
						/>
						<span className="px-1.5">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>

					{/* Dropdown Menu */}
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="absolute top-16 right-6 w-44 bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden shadow-lg shadow-black/60 z-50 animate-fadeIn"
						>
							<button
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex items-center justify-center gap-2 w-full py-2 text-gray-300 hover:bg-blue-600 hover:text-white transition-all"
							>
								<PiUserCircleLight fontSize={22} />
								Profile
							</button>
							<button
								onClick={handleLogout}
								className="flex items-center justify-center gap-2 w-full py-2 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
							>
								<IoLogOutOutline fontSize={20} />
								Logout
							</button>
						</div>
					)}
				</div>
			) : (
				<Link to="/signin">
					<button className="py-2 px-5 border border-gray-500 rounded-full bg-[#1a1a1a] text-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-200">
						Sign In
					</button>
				</Link>
			)}
		</header>
	);
};

export default Header;
