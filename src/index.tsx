
import "@seanalunni/style/fix";

import layout from "@seanalunni/style/layout";
import { Win } from "./component/win/win";
import { render } from 'solid-js/web';

/** The main component of the page */
function Root() {
  return <>
    <div class={`${layout.root} ${layout.slot}`}>
      <Win header="ciao" style={{ width: "300px", height: "200px", top: "100px", left: "400px" }}>
        A
      </Win>
      <Win style={{ width: "300px", height: "200px", top: "50px", left: "300px" }}>
        B
      </Win>
    </div>
  </>
}

render(() => <Root />, document.body);