import { useState, useEffect, useMemo, memo } from 'react';

export const TradingViewTimelineNews = memo(() => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const iframeSrc = useMemo(() => {
    const config = {
      feedMode: "all_symbols",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      locale: "en"
    };
    return `https://www.tradingview.com/embed-widget/timeline/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
  }, []);

  return (
    <div className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden border border-border bg-surface">
      <iframe
        src={iframeSrc}
        title="TradingView Global Timeline"
        className="w-full h-full border-0"
        allowtransparency="true"
        allow="encrypted-media"
        loading="lazy"
      />
    </div>
  );
});

