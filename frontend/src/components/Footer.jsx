import React from "react";
import { FaPenAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="w-full bg-[#0f0f0f] text-gray-400 py-10 px-6 md:px-16 border-t border-gray-800">
			<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
				{/* Brand */}
				<div className="flex flex-col gap-3">
					<h1 className="flex items-center gap-2 text-2xl font-bold text-white">
						YapChat <FaPenAlt className="text-blue-500" />
					</h1>
					<p className="text-sm text-gray-500">
						Chat freely. Connect instantly.
					</p>
				</div>

				{/* Contact */}
				<div>
					<h2 className="font-semibold mb-3 text-white">Contact</h2>
					<p>Rajeev Kumar</p>
					<Link
						to="mailto:contact.rajeev969300@gmail.com"
						className="text-blue-500 hover:text-blue-400 transition-all duration-200"
					>
						contact.rajeev969300@gmail.com
					</Link>
				</div>

				{/* Pages */}
				<div>
					<h2 className="font-semibold mb-3 text-white">Pages</h2>
					<ul className="space-y-1">
						{["Chat App", "SignIn", "SignUp", "Home"].map((page) => (
							<li key={page}>
								<Link
									to={
										page === "Chat App"
											? "/"
											: `/${page.toLowerCase()}`
									}
									className="hover:text-blue-400 transition-all duration-200"
								>
									{page}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Links */}
				<div>
					<h2 className="font-semibold mb-3 text-white">Links</h2>
					<ul className="space-y-1">
						<li>
							<a
								href="https://www.linkedin.com/in/rajeev-kumarlink/"
								target="_blank"
								rel="noreferrer"
								className="hover:text-blue-400 transition-all duration-200"
							>
								LinkedIn
							</a>
						</li>
						<li>
							<a
								href="https://github.com/rajeevcodes1"
								target="_blank"
								rel="noreferrer"
								className="hover:text-blue-400 transition-all duration-200"
							>
								Github
							</a>
						</li>
						<li>
							<a
								href="mailto:contact.rajeev969300@gmail.com"
								target="_blank"
								rel="noreferrer"
								className="hover:text-blue-400 transition-all duration-200"
							>
								E-Mail
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Divider */}
			<div className="border-t border-gray-800 mt-8 pt-4 text-center">
				<p className="text-gray-500 text-sm">
					All rights reserved © 2025{" "}
					<span className="text-white font-semibold">YapChat</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
