import { createContext } from 'react';
import { makeAutoObservable } from "mobx";
import MESSAGES from "./message.json";
import { handler } from "./detect";

const MESSAGE_STREAM_STEP = 30;

function scrollLatestIntoView() {
	document.querySelector('#message-list-bottom').scrollIntoView();
}

class Store {
	messages = MESSAGES.slice(0, 2);
	isRunning = false;

	_intervalId = null;

	constructor() {
		makeAutoObservable(this);

		handler.onDetected = () => {
			this.start();
		};

		handler.onNotDetected = () => {
			this.stop();
		};

		// for debug
		document.addEventListener("keydown", (e) => {
			// console.log(e);
			if (e.key === "1") {
				this.start();
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "1") {
				this.stop();
			}
		});
	}

	_resetMessages() {
		this.messages = MESSAGES.slice(0, 2);
		scrollLatestIntoView();
	}

	start() {
		if (this.isRunning) {
			return;
		}
		this.isRunning = true;

		document.body.classList.remove("inactive");

		if (this.messages.length === MESSAGES.length) {
			this._resetMessages();
		}

		// next message's role is user
		const nextMessageIndex = this.messages.length;
		this.messages.push(MESSAGES[nextMessageIndex]);
		const assistantMessage = MESSAGES[nextMessageIndex + 1];

		// prepare next assistant message
		this.messages.push({
			role: "assistant",
			content: "",
		});

		let stringIndex = 0;
		this._intervalId = setInterval(() => {
			const message = this.messages.at(-1);
			message.content += assistantMessage.content.slice(stringIndex, stringIndex + MESSAGE_STREAM_STEP);
			stringIndex += MESSAGE_STREAM_STEP;
			if (stringIndex >= assistantMessage.content.length) {
				// next turn
				// TODO: refactor
				this.stop();
				this.start();
			}
			scrollLatestIntoView();
		}, 16);
	}

	stop() {
		if (!this.isRunning) {
			return;
		}
		this.isRunning = false;
		clearInterval(this._intervalId);
		this._intervalId = null;

		document.body.classList.add("inactive");
	}

}

const store = new Store()

export const StoreContext = createContext(store);
