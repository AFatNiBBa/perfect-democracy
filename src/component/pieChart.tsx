
import { Accessor, ComponentProps, createMemo, Index, mapArray, Show } from "solid-js";
import { memoProps, splitAndMemoProps } from "solid-ctrl-flow";
import { DataType } from "csstype";

/** The parameters of the labels */
const LABEL_HEIGHT = .06, LABEL_OFFSET = .02;

/** The parameters of the SVG circle */
const START = 0, END = 1, CENTER = (END + START) / 2, RADIUS = (END - START) / 2 - LABEL_HEIGHT;

/** Component that generates an SVG pie chart based on the provided values */
export function PieChart<T>(props: { items: T[] } & Conv<T> & ComponentProps<"svg">) {
	const [ mine, other ] = splitAndMemoProps(props, [ "items", "getLabel", "getColor", "getValue" ]);
	const slices = createMemo(mapArray(() => mine.items, (x, i) => getSlice(mine, x, i)));
	const total = createMemo(() => slices().reduce((sum, x) => sum + x.value, 0));
	const arcs = createMemo(() => getArcs(total(), slices()).toArray());
	return <>	
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox={`${START} ${START} ${END} ${END}`} {...other}>
			{/* I use "Index" because it caches its content by index, "For" would have cached by value, which wouldn't be useful since the arc objects change every time */}
			<Index each={arcs()}>
					{x => <PieSliceArc arc={x()} />}
			</Index>
			<Index each={arcs()}>
					{x => <PieSliceLabel arc={x()} />}
			</Index>
    </svg>
	</>
}

//#region PARTS

/** Component that generates the path of a single slice of a {@link PieChart} */
function PieSliceArc(props: { arc: Arc }) {
	return <>
		<path
			fill={props.arc.color}
			d={`
				M ${CENTER} ${CENTER}
				L ${props.arc.xStart} ${props.arc.yStart}
				A ${RADIUS} ${RADIUS} 0 ${+(props.arc.rad > Math.PI)} 1 ${props.arc.xEnd} ${props.arc.yEnd}
				Z
			`}
		/>
	</>
}

/** Component that generates the label of a single slice of a {@link PieChart} */
function PieSliceLabel(props: { arc: Arc }) {
	return <>
		<Show when={props.arc.label}>
			{label => <>
				<text 
					x={props.arc.xLabel} 
					y={props.arc.yLabel} 
					
					children={label()}
					dominant-baseline={props.arc.yLabel > CENTER ? "mathematical" : "text-bottom"}
					text-anchor={props.arc.xLabel > CENTER ? "start" : "end"}
					font-size={LABEL_HEIGHT.toString()}
					font-weight="bold"

					stroke-width="0.003"
					stroke="black"
					fill="white"
				/>
			</>}
		</Show>
	</>
}

//#endregion

//#region UTILS

/**
 * Converts a sequence of {@link Slice}s into sequential SVG arcs
 * @param total The sum of the values of the elements of {@link items}
 * @param items The sequence of {@link Slice}s
 */
function *getArcs(total: number, items: Iterable<Slice>) {
	var radStart = 0, xStart = CENTER + RADIUS, yStart = CENTER; // The initial values are those of the 0° angle
	for (const elm of items) {
		const rad = elm.value * Math.PI * 2 / total;
		const radEnd = rad + radStart;
		const radLabel = (radEnd + radStart) / 2;
		radStart = radEnd;
		yield {
			...elm,
			rad,
			xStart,
			yStart,
			xEnd: xStart = Math.cos(radEnd) * RADIUS + CENTER,
			yEnd: yStart = Math.sin(radEnd) * RADIUS + CENTER,
			xLabel: Math.cos(radLabel) * (RADIUS + LABEL_OFFSET) + CENTER,
			yLabel: Math.sin(radLabel) * (RADIUS + LABEL_OFFSET) + CENTER,
		} satisfies Arc;
	}
}

/**
 * Converts {@link obj} into a {@link Slice} based a {@link Conv}
 * @param conv The object to which to ask the values for the new {@link Slice}
 * @param obj The object to convert
 * @param i Reference to the index of {@link obj} inside of the list to which it belongs to
 */
function getSlice<T>(conv: Conv<T>, obj: T, i: Accessor<number>) {
	return memoProps<Slice>({
		get label() { return conv.getLabel?.(obj, i); },
		get color() { return conv.getColor(obj, i); },
		get value() { return conv.getValue(obj, i); }
	});
}

//#endregion

//#region TYPES

/** Object that provides the details on how to convert a value of type {@link T} into a {@link Slice} */
interface Conv<T> {
	getLabel?(x: T, i: Accessor<number>): string | undefined;
	getColor(x: T, i: Accessor<number>): DataType.Color;
	getValue(x: T, i: Accessor<number>): number;
}

/** Type that represents a fully calculated arc */
interface Arc extends Slice {
	rad: number;
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
	xLabel: number;
	yLabel: number;
}

/** Type that represents a single slice of pie chart */
interface Slice {
	label: string | undefined;
	color: DataType.Color;
	value: number;
}

//#endregion