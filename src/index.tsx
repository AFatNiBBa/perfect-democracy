
import "@seanalunni/style/fix";

import layout from "@seanalunni/style/layout";

import { PieChart } from "./component/pieChart";
import { Win } from "./component/win/win";
import { createSignal } from "solid-js";
import { render } from 'solid-js/web';

/** The main component of the page */
function Root() {
  const [ g, s ] = createSignal(4);
  Object.assign(globalThis, { s });
  return <>
    <div class={`${layout.root} ${layout.slot}`}>
      <Win header="ciao" style={{ width: "300px", height: "200px", top: "100px", left: "400px" }}>
        A
      </Win>
      <Win style={{ width: "300px", height: "200px", top: "50px", left: "300px" }}>
        <PieChart<{ l?: string, c: string, v: number }>
          class={layout.stretch}
          getLabel={x => x.l}
          getColor={x => x.c}
          getValue={x => x.v}
          items={[
            { l: "a1", c: "red", v: 3 },
            { l: "a2", c: "orange", get v() { return g(); } },
            { l: "a3", c: "dodgerblue", v: 4 },
            { l: "a4", c: "green", v: 6 },
            { c: "transparent", v: 7 }
          ]}
        />
      </Win>
    </div>
  </>
}

render(() => <Root />, document.body);