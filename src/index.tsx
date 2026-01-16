
import "./test/demo";
import "@seanalunni/style/fix";

import layout from "@seanalunni/style/layout";

import { For, render, Show } from 'solid-js/web';
import { PieChart } from "./component/pieChart";
import { DEMO_RESULTS } from "./test/demo";
import { Win } from "./component/win/win";

/** The main component of the page */
function Root() {
  return <>
    <div class={`${layout.root} ${layout.slot}`}>
      {/* <Win style={{ width: "300px", height: "200px", top: "50px", left: "300px" }}>
        <PieChart<{ l?: string, c: string, v: number }>
          class={layout.stretch}
          getLabel={x => x.l}
          getColor={x => x.c}
          getValue={x => x.v}
          items={[
            { l: "Fratelli d'Italia", c: "#003366", v: 7300000 },
            { l: "Partito Democratico", c: "#E30613", v: 5400000 },
            { l: "Movimento 5 Stelle", c: "#FFD500", v: 4300000 },
            { l: "Lega", c: "#006600", v: 2500000 },
            { l: "Forza Italia", c: "#0066CC", v: 2300000 },
            { l: "Azione - Italia Viva", c: "#E95C0E", v: 2100000 },
            { l: "Alleanza Verdi-Sinistra", c: "#CC0000", v: 1100000 }
          ]}
        />
      </Win> */}

      <Win style={{ width: "300px", height: "200px", top: "50px", left: "300px" }}>
        <div style={{ display: "grid", gap: "1ch" }}>
          <For each={DEMO_RESULTS}>
            {(x, i) => <>
              <Show when={i()}>
                <hr style={{ width: "100%" }} />
              </Show>
              <div>
                <PieChart
                  class={layout.stretch}
                  items={x}
                  getLabel={y => y.party.name}
                  getColor={y => y.party.color}
                  getValue={y => y.value}
                />
              </div>
            </>}
          </For>
        </div>
      </Win>
    </div>
  </>
}

render(() => <Root />, document.body);