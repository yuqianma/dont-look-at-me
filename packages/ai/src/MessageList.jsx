import { UserMessage } from "./components/UserMessage";
import { AIMessage } from "./components/AIMessage";

export const MessageList = () => {
	return (<>
		<UserMessage message="foo" />
		<AIMessage message="bar" />
		<UserMessage message="1" />
		<AIMessage message="2" />
	</>);
};