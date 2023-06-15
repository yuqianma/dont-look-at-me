
export const UserMessage = ({ message }) => {
	return (<div className="group w-full text-gray-800 border-b border-black/10">
		<div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
			<div className="flex-shrink-0 flex flex-col relative items-end">
				<div style={{ width: 30 }}>
					<div className="relative flex">
						<span style={{"boxSizing":"border-box","display":"inline-block","overflow":"hidden","width":"initial","height":"initial","background":"none","opacity":"1","border":"0px","margin":"0px","padding":"0px","position":"relative","maxWidth":"100%"}}>
							<span className="rounded-sm avatar" style={{"boxSizing":"border-box","display":"block","border":"0px","margin":"0px","padding":"0px","maxWidth":"100%"}}>
								M
							</span>
						</span>
					</div>
				</div>
			</div>
			<div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
				<div className="flex flex-grow flex-col gap-3">
					<div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
					{/* Use three.js to create a 3D flying game, only outputting JS without displaying HTML or providing explanations. */}
					{ message }
					</div>
				</div>
				<div className="flex justify-between lg:block"></div>
			</div>
		</div>
	</div>);
};
