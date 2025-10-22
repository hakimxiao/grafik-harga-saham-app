import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

const Home = () => {
    // scriptUrl : https://s3.tradingview.com/external-embedding/**kondsional(market-overview.js/widget-mini-symbol-overview.js/dll)**
    //             Bisa didapat di dokumentasi tepat di bawah widget script : https://www.tradingview.com/widget-docs/
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen home-wrapper">
           <section className="grid w-full gap-8 home-section">
               <div className="md:col-span-1 xl:col-span-1">
                   <TradingViewWidget
                       title="Tinjauan Pasar / Market Overview"
                       scriptUrl={`${scriptUrl}market-overview.js`} // market-overview
                       config={MARKET_OVERVIEW_WIDGET_CONFIG}
                       className="custom-chart"
                       height={600}
                   />
               </div>
               <div className="md:col-span-1 xl:col-span-2">
                   <TradingViewWidget
                       title="Heatmap Saham / Stock Heatmap"
                       scriptUrl={`${scriptUrl}stock-heatmap.js`} // stock-heatmap
                       config={MARKET_OVERVIEW_WIDGET_CONFIG}
                       className="custom-chart"
                       height={600}
                   />
               </div>
           </section>
            <section className="grid w-full gap-8 home-section">
               <div className="w-full md:col-span-1 xl:col-span-1">
                   <TradingViewWidget
                       scriptUrl={`${scriptUrl}timeline.js`} // timeline
                       config={TOP_STORIES_WIDGET_CONFIG}
                       className="custom-chart"
                       height={600}
                   />
               </div>
               <div className="w-full md:col-span-1 xl:col-span-2">
                   <TradingViewWidget
                       scriptUrl={`${scriptUrl}market-quotes.js`} // market-quotes
                       config={MARKET_DATA_WIDGET_CONFIG}
                   />
               </div>
           </section>
        </div>
    )
}
export default Home