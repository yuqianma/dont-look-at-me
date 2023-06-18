// import { useState, useEffect } from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "./store";
import { UserMessage } from "./components/UserMessage";
import { AIMessage } from "./components/AIMessage";


export const MessageList = observer(() => {
	// const [message, setMessage] = useState("");

	// useEffect(() => {
	// 	let index = 0;
	// 	const intervalId = setInterval(() => {
	// 		index++;
	// 		setMessage(TestString.substring(0, index));
	// 		if (index >= TestString.length) {
	// 			clearInterval(intervalId);
	// 		}
	// 		document.querySelector('#message-list-bottom').scrollIntoView();
	// 	}, 16);

	// 	return () => {
	// 		clearInterval(intervalId);
	// 	}
	// }, []);

	const store = useContext(StoreContext);
	const messages = store.messages;

	return (<>
		{ messages.map((message, index) => {
			if (message.role === "user") {
				return <UserMessage key={index} message={message.content} />
			} else if (message.role === "assistant") {
				return <AIMessage key={index} message={message.content} />
			}
		}) }
	</>);
});