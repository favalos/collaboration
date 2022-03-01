import Statemine from "public/imgs/icons/chain/statemine.svg";
import Bifrost from "public/imgs/icons/chain/bifrost.svg";
import Polkadot from "public/imgs/icons/chain/polkadot.svg";
import Karura from "public/imgs/icons/chain/karura.svg";
import Khala from "public/imgs/icons/chain/khala.svg";
import Kusama from "public/imgs/icons/chain/kusama.svg";
import Kintsugi from "public/imgs/logos/kintsugi.svg"
import Default from "public/imgs/icons/chain/default.svg";

function ChainIcon({ chainName }) {
  if (chainName === "kintsugi") {
    return <Kintsugi />
  }
  if (chainName === "kusama") {
    return <Kusama />
  }
  if (chainName === "statemine") {
    return <Statemine />;
  }
  if (chainName === "bifrost") {
    return <Bifrost />;
  }
  if (chainName === "polkadot") {
    return <Polkadot />;
  }
  if (chainName === "karura") {
    return <Karura />;
  }
  if (chainName === "khala") {
    return <Khala />;
  }
  return <Default />;
}

export default ChainIcon;
