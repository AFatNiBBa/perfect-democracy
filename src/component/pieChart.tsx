
import { Accessor, ComponentProps, createMemo, Index, mapArray, Show } from "solid-js";
import { memoProps, splitAndMemoProps } from "solid-ctrl-flow";
import { DataType } from "csstype";

/** The parameters of the SVG circle */
const START = 0, END = 1, CENTER = (END + START) / 2, RADIUS = (END - START) / 2;

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
					{x => <PieArc arc={x()} total={total()} />}
			</Index>
    </svg>
	</>
}

/** Component that generates a single slice of a {@link PieChart} */
function PieArc(props: { arc: Arc, total: number }) {
	const arc = () => props.arc;
	// const perc = createMemo(() => `${(arc().value * 100 / props.total).toFixed(2)}%`)
	return <>
		<path
			fill={arc().color}
			d={`
				M ${CENTER} ${CENTER}
				L ${arc().xStart} ${arc().yStart}
				A ${RADIUS} ${RADIUS} 0 ${+(arc().rad > Math.PI)} 1 ${arc().xEnd} ${arc().yEnd}
				Z
			`}
		/>
		{/* <text x={arc().xLabel} y={arc().yLabel}>
			<Show when={arc().label} fallback={perc()}>
				{x => <>{x()} ({perc()})</>}
			</Show>
		</text> */}
	</>
}

/**
 * Converts a sequence of {@link Slice}s into sequential SVG arcs
 * @param total The sum of the values of the elements of {@link items}
 * @param items The sequence of {@link Slice}s
 */
function *getArcs(total: number, items: Iterable<Slice>) {
	var radStart = 0, xStart = END, yStart = CENTER; // The initial values are those of the 0° angle
	for (const elm of items) {
		const radEnd = elm.value * Math.PI * 2 / total + radStart;
		const radLabel = (radEnd + radStart) / 2;
		yield {
			...elm,
			xStart,
			yStart,
			xEnd: xStart = Math.cos(radEnd) * RADIUS + CENTER,
			yEnd: yStart = Math.sin(radEnd) * RADIUS + CENTER,
			xLabel: Math.cos(radLabel) * RADIUS / 2 + CENTER,
			yLabel: Math.sin(radLabel) * RADIUS / 2 + CENTER,
			rad: radStart = radEnd
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

/** Object that provides the details on how to convert a value of type {@link T} into a {@link Slice} */
interface Conv<T> {
	getLabel?(x: T, i: Accessor<number>): string | undefined;
	getColor(x: T, i: Accessor<number>): DataType.Color;
	getValue(x: T, i: Accessor<number>): number;
}

/** Type that represents a fully calculated arc */
interface Arc extends Slice {
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
	xLabel: number;
	yLabel: number;
	rad: number;
}

/** Type that represents a single slice of pie chart */
interface Slice {
	label: string | undefined;
	color: DataType.Color;
	value: number;
}