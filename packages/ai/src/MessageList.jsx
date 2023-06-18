import { useState, useEffect } from "react";
import { UserMessage } from "./components/UserMessage";
import { AIMessage } from "./components/AIMessage";

const TestString = "```javascript\nimport * as THREE from 'three';\n\n// Create scene\nconst scene = new THREE.Scene();\n\n// Create camera\nconst camera = new THREE.PerspectiveCamera(\n  75,\n  window.innerWidth / window.innerHeight,\n  0.1,\n  1000\n);\ncamera.position.z = 5;\n\n// Create renderer\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\n\n// Create geometry\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\n\n// Create controls\nconst controls = new THREE.OrbitControls(camera, renderer.domElement);\n\n// Create directional light\nconst directionalLight = new THREE.DirectionalLight(0xffffff, 1);\ndirectionalLight.position.set(1, 1, 1).normalize();\nscene.add(directionalLight);\n\n// Create game loop\nfunction animate() {\n  requestAnimationFrame(animate);\n\n  // Rotate cube\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n\n  // Update controls\n  controls.update();\n\n  renderer.render(scene, camera);\n}\nanimate();\n``` \n\nIn this updated version, I added the following features:\n\n- Added controls using `OrbitControls` to allow the player to move the camera around the scene.\n- Created a directional light to provide better illumination on the objects in the scene.\n\nFeel free to continue adding more features and functionality to this game using the THREE.js library!";

export const MessageList = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		let index = 0;
		const intervalId = setInterval(() => {
			index++;
			setMessage(TestString.substring(0, index));
			if (index >= TestString.length) {
				clearInterval(intervalId);
			}
			document.querySelector('#message-list-bottom').scrollIntoView();
		}, 16);

		return () => {
			clearInterval(intervalId);
		}
	}, []);

	return (<>
		<UserMessage message="foo" />
		<AIMessage message="bar" />
		<UserMessage message="1" />
		<AIMessage message={message} />
	</>);
};