
import style from "./win.module.scss";
import layout from "@seanalunni/style/layout";

import { ComponentProps, JSX, onCleanup, onMount, splitProps } from "solid-js";
import { memoProps } from "solid-ctrl-flow";

/** Component that simulates a floating window */
export function Win(props: { header?: JSX.Element } & ComponentProps<"div">) {
	const [ memo, mine, other ] = processProps(props);
	var moving = false, prevX = 0, prevY = 0;
	var div: HTMLDivElement;

	onMount(() => {
		const doc = div.ownerDocument;
		const onMouseUp = () => moving = false;
		
		doc.addEventListener("mouseup", onMouseUp);
		doc.addEventListener("mousemove", onMouseMove);
		onCleanup(() => {
			doc.removeEventListener("mouseup", onMouseUp);
			doc.removeEventListener("mousemove", onMouseMove);
		});

		function onMouseMove(e: MouseEvent) {
			if (!moving) return;
			const nextX = prevX - e.clientX;
			const nextY = prevY - e.clientY;
			prevX = e.clientX;
			prevY = e.clientY;
			const { style } = div;
			style.top = div.offsetTop - nextY + "px";
			style.left = div.offsetLeft - nextX + "px";
		}
	});
	
	return <>
		<div ref={div!} tabIndex={-1} classList={{ [`${style.win} ${layout.scroll} ${memo.class ?? ""}`]: true, ...memo.classList }} {...other}>
			<header
				children={mine.header}
				onMouseDown={e => {
					prevX = e.clientX;
					prevY = e.clientY;
					moving = true;
				}}
			/>
			<main class={layout.slot}>
				{mine.children}
			</main>
		</div>
	</>
}

/**
 * Sets-up {@link Win}'s properties
 * @param props The properties to organize
 */
function processProps(props: ComponentProps<typeof Win>) {
	const out = splitProps(props, [ "class", "classList" ], [ "header", "children" ]);
	out[0] = memoProps(out[0]);
	return out;
}