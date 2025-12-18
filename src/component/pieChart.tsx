
import { Accessor, ComponentProps, createMemo, Index, mapArray } from "solid-js";
import { memoProps, splitAndMemoProps } from "solid-ctrl-flow";
import { DataType } from "csstype";

/** The parameters of the SVG circle */
const START = 0, END = 1, CENTER = (END + START) / 2, RADIUS = (END - START) / 2;

/** Component that generates an SVG pie chart based on the provided values */
export function PieChart<T>(props: { items: T[] } & Conv<T> & ComponentProps<"svg">) {
	const [ mine, other ] = splitAndMemoProps(props, [ "items", "getValue", "getColor" ]);
	const slices = createMemo(mapArray(() => mine.items, (x, i) => getSlice(mine, x, i)));
	const total = createMemo(() => slices().reduce((sum, x) => sum + x.value, 0));
	const arcs = createMemo(() => getArcs(total(), slices()).toArray());
	return <>	
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox={`${START} ${START} ${END} ${END}`} {...other}>
			{/* I use "Index" because it caches its content by index, "For" would have cached by value, which wouldn't be useful since the arc objects change every time */}
			<Index each={arcs()}>
					{arc => <>
						<path
							fill={arc().color}
							d={`
								M ${CENTER} ${CENTER}
								L ${arc().xStart} ${arc().yStart}
								A ${RADIUS} ${RADIUS} 0 ${+(arc().rad > Math.PI)} 1 ${arc().xEnd} ${arc().yEnd}
								Z
							`}
						/>
					</>}
			</Index>
    </svg>
	</>
}

/**
 * Converts a sequence of {@link Slice}s into sequential SVG arcs
 * @param total The sum of the values of the elements of {@link items}
 * @param items The sequence of {@link Slice}s
 */
function *getArcs(total: number, items: Iterable<Slice>) {
	var rad = 0, xStart = END, yStart = CENTER; // The initial values are those of the 0° angle
	for (const elm of items) {
		yield {
			color: elm.color,
			xStart,
			yStart,
			rad: rad += elm.value * Math.PI * 2 / total,
			xEnd: xStart = Math.cos(rad) * RADIUS + CENTER,
			yEnd: yStart = Math.sin(rad) * RADIUS + CENTER
		};
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
		get color() { return conv.getColor(obj, i); },
		get value() { return conv.getValue(obj, i); }
	});
}

/** Object that provides the details on how to convert a value of type {@link T} into a {@link Slice} */
interface Conv<T> {
	getColor(x: T, i: Accessor<number>): DataType.Color;
	getValue(x: T, i: Accessor<number>): number;
}

/** Type that represents a single slice of pie chart */
interface Slice {
	color: DataType.Color;
	value: number;
}