import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Send } from "lucide-react";
import { createChart, LineSeries, type IChartApi, type ISeriesApi, type LineData } from "lightweight-charts";
import { useAuth } from "../../hooks/useAuth";
import "./StockDashboard.css";

const TIME_SERIES_OPTIONS = ["1D", "5D", "1M", "6M", "1Y", "5Y", "MAX"];

interface StockItem {
  symbol: string;
  name: string;
}

interface ChatMessage {
  timestamp: string;
  category: string;
  text: string;
}

function makeStockItem(symbol: string): StockItem {
  return {
    symbol,
    name: `${symbol} Corp.`,
  };
}

function formatPrice(value: number) {
  return Number(value || 0).toFixed(2);
}

export default function StockDashboard() {
  const { authStatus } = useAuth();

  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [timeSeries, setTimeSeries] = useState("1M");
  const [chartData, setChartData] = useState<LineData[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [newStock, setNewStock] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [changePct, setChangePct] = useState(0);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const selectedLabel = useMemo(() => {
    return selectedStock
      ? `${selectedStock.symbol} · ${selectedStock.name}`
      : "Select a stock";
  }, [selectedStock]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: "rgba(0,0,0,0)" },
        textColor: "#D6E4FF",
      },
      grid: {
        vertLines: { color: "rgba(255, 151, 77, 0.08)" },
        horzLines: { color: "rgba(255, 151, 77, 0.08)" },
      },
      rightPriceScale: {
        borderColor: "rgba(255, 139, 77, 0.18)",
      },
      timeScale: {
        borderColor: "rgba(255, 139, 77, 0.18)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: "rgba(255, 172, 77, 0.45)" },
        horzLine: { color: "rgba(255, 172, 77, 0.45)" },
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: "#ff8a3d",
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    series.setData([]);

    chartInstanceRef.current = chart;
    lineSeriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartInstanceRef.current = null;
      lineSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lineSeriesRef.current) {
      lineSeriesRef.current.setData(chartData);
      chartInstanceRef.current?.timeScale().fitContent();
    }
  }, [chartData]);

  const clearSelectedStockData = () => {
    setChartData([]);
    setChatHistory([]);
    setPrice(0);
    setChange(0);
    setChangePct(0);
    setTimeSeries("1M");
  };

  const loadStocks = async () => {
    if (authStatus !== "authed") {
      setStocks([]);
      setSelectedStock(null);
      clearSelectedStockData();
      return;
    }

    try {
      setErrorMessage("");

      const response = await axios.get("/api/stocks");
      const symbols: string[] = Array.isArray(response.data?.symbols) ? response.data.symbols : [];
      const items = symbols.map(makeStockItem);

      setStocks(items);

      setSelectedStock((prev) => {
        if (prev && symbols.includes(prev.symbol)) {
          return items.find((item) => item.symbol === prev.symbol) || prev;
        }
        return items[0] || null;
      });

      if (!items.length) {
        clearSelectedStockData();
      }
    } catch (err: any) {
      console.warn("Failed to load stocks:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to load stocks.");
      setStocks([]);
      setSelectedStock(null);
      clearSelectedStockData();
    }
  };

  const loadStockData = async (symbol: string, rangeOverride?: string) => {
    if (authStatus !== "authed" || !symbol) {
      clearSelectedStockData();
      return;
    }

    try {
      setIsLoadingChart(true);
      setErrorMessage("");

      const [stockResponse, marketResponse] = await Promise.all([
        axios.get(`/api/stocks/${symbol}`),
        axios.get(`/api/stocks/${symbol}/market-data`, {
          params: rangeOverride ? { range: rangeOverride } : {},
        }),
      ]);

      const stock = stockResponse.data?.stock;
      const market = marketResponse.data;

      if (!stock) {
        throw new Error("No stock record returned.");
      }

      setTimeSeries(stock.timeSeries || rangeOverride || "1M");
      setChatHistory(Array.isArray(stock.chatHistory) ? stock.chatHistory : []);

      if (market?.range) {
        setTimeSeries(market.range);
      }

      setChartData(Array.isArray(market?.series) ? market.series : []);
      setPrice(market?.currentPrice ?? 0);
      setChange(market?.priceChange ?? 0);
      setChangePct(market?.priceChangePercent ?? 0);
    } catch (err: any) {
      console.warn("Failed to load stock data:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to load stock data.");
      clearSelectedStockData();
    } finally {
      setIsLoadingChart(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authed") {
      loadStocks();
    } else if (authStatus === "anon") {
      setStocks([]);
      setSelectedStock(null);
      clearSelectedStockData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  useEffect(() => {
    if (selectedStock?.symbol) {
      loadStockData(selectedStock.symbol);
    } else {
      clearSelectedStockData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStock, authStatus]);

  const handleTimeSeriesChange = async (range: string) => {
    if (!selectedStock?.symbol || isLoadingChart || range === timeSeries) return;

    try {
      setErrorMessage("");

      await axios.patch(`/api/stocks/${selectedStock.symbol}/timeseries`, {
        range,
      });

      await loadStockData(selectedStock.symbol, range);
    } catch (err: any) {
      console.warn("Time series update failed:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to update time series.");
    }
  };

  const handleAddStock = async () => {
    const symbol = newStock.trim().toUpperCase();
    if (!symbol || authStatus !== "authed") return;

    try {
      setErrorMessage("");

      const response = await axios.post("/api/stocks/add", { symbol });
      const symbols: string[] = Array.isArray(response.data?.symbols) ? response.data.symbols : [];
      const items = symbols.map(makeStockItem);

      setStocks(items);
      setSelectedStock(items.find((item) => item.symbol === symbol) || items[0] || null);
      setNewStock("");
    } catch (err: any) {
      console.warn("Add stock failed:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to add stock.");
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    if (authStatus !== "authed") return;

    try {
      setErrorMessage("");

      const response = await axios.delete(`/api/stocks/remove/${symbol}`);
      const symbols: string[] = Array.isArray(response.data?.symbols) ? response.data.symbols : [];
      const items = symbols.map(makeStockItem);

      setStocks(items);

      if (selectedStock?.symbol === symbol) {
        setSelectedStock(items[0] || null);
      }

      if (!items.length) {
        clearSelectedStockData();
      }
    } catch (err: any) {
      console.warn("Remove stock failed:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to remove stock.");
    }
  };

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !selectedStock?.symbol || authStatus !== "authed" || isSendingMessage) return;

    try {
      setIsSendingMessage(true);
      setErrorMessage("");

      const response = await axios.post(
        `/api/stocks/${selectedStock.symbol}/chat/messages`,
        { text }
      );

      const stock = response.data?.stock;
      if (stock?.chatHistory) {
        setChatHistory(stock.chatHistory);
      }

      setMessageInput("");
    } catch (err: any) {
      console.warn("Chat failed:", err?.response?.data?.error || err?.message);
      setErrorMessage(err?.response?.data?.error || "Failed to send message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="sd-root">
      <aside className="sd-sidebar">
        <div className="sd-sidebar-header">
          <div>
            <div className="sd-kicker">WATCHLIST</div>
            <h2>Stocks</h2>
          </div>
        </div>

        <div className="sd-auth-state">
          {authStatus === "loading" && <span>Loading session…</span>}
          {authStatus === "authed" && <span>Signed in</span>}
          {authStatus === "anon" && <span>Not signed in</span>}
        </div>

        <div className="sd-add-stock">
          <input
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Add ticker"
            disabled={authStatus !== "authed"}
          />
          <button
            onClick={handleAddStock}
            aria-label="Add stock"
            disabled={authStatus !== "authed"}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="sd-stock-list">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className={`sd-stock-item ${
                selectedStock?.symbol === stock.symbol ? "active" : ""
              }`}
              onClick={() => setSelectedStock(stock)}
            >
              <div className="sd-stock-meta">
                <strong>{stock.symbol}</strong>
                <span>{stock.name}</span>
              </div>
              <button
                className="sd-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStock(stock.symbol);
                }}
                aria-label={`Remove ${stock.symbol}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="sd-main">
        <section className="sd-chart-panel">
          <div className="sd-chart-topbar">
            <div>
              <div className="sd-kicker">STOCK VIEWER</div>
              <h1>{selectedLabel}</h1>
              <div className="sd-price-row">
                <span className="sd-price">${formatPrice(price)}</span>
                <span className={`sd-change ${change >= 0 ? "up" : "down"}`}>
                  {change >= 0 ? "+" : ""}
                  {formatPrice(change)} ({changePct >= 0 ? "+" : ""}
                  {formatPrice(changePct)}%)
                </span>
              </div>
            </div>

            <div className="sd-timescales">
              {TIME_SERIES_OPTIONS.map((range) => (
                <button
                  key={range}
                  className={range === timeSeries ? "active" : ""}
                  onClick={() => handleTimeSeriesChange(range)}
                  disabled={!selectedStock || isLoadingChart}
                >
                  {range}
                </button>
              ))}

            </div>
          </div>

          <div className="sd-chart-wrap">
            {isLoadingChart && <div className="sd-chart-loading">Loading chart…</div>}
            <div ref={chartContainerRef} className="sd-chart" />
          </div>
        </section>

        <section className="sd-chat-panel">
          <div className="sd-chat-header">
            <div>
              <div className="sd-kicker">AI TERMINAL</div>
              <h2>Answers & Insights</h2>
            </div>
          </div>

          {errorMessage ? <div className="sd-error-banner">{errorMessage}</div> : null}

          <div className="sd-chat-history">
            {chatHistory.map((msg, idx) => (
              <div key={`${msg.timestamp}-${idx}`} className={`sd-chat-msg ${msg.category}`}>
                <span className="sd-chat-badge">{msg.category}</span>
                <span className="sd-chat-text">{msg.text}</span>
                <span className="sd-chat-time">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="sd-chat-input">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Ask about the stock..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={!selectedStock || isSendingMessage}
            />
            <button
              onClick={handleSendMessage}
              aria-label="Send message"
              disabled={!selectedStock || isSendingMessage}
            >
              <Send size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
