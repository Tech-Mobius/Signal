"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DebugPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CATEGORY_COLORS = {
    Crypto: 'text-relay-blue',
    Router: 'text-amber-sos',
    Discovery: 'text-steady-green',
    Error: 'text-caution-red',
    WebRTC: 'text-relay-blue',
    File: 'text-fog',
    Mesh: 'text-steady-green',
    Signaling: 'text-relay-blue',
    Identity: 'text-snow',
    Status: 'text-steady-green',
    Sim: 'text-caution-red',
};
function DebugPanel({ logs }) {
    const containerRef = (0, react_1.useRef)(null);
    // Auto-scroll to top (newest log is prepended, so top = newest)
    (0, react_1.useEffect)(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [logs]);
    if (logs.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog/50 font-mono italic py-2", children: "Waiting for network activity..." }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "flex flex-col gap-0", children: logs.map((log, idx) => {
            const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const color = CATEGORY_COLORS[log.category] || 'text-fog';
            return ((0, jsx_runtime_1.jsxs)("div", { className: "log-row", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-fog/40 flex-shrink-0", children: ["[", time, "]"] }), (0, jsx_runtime_1.jsxs)("span", { className: `font-semibold flex-shrink-0 ${color}`, children: ["[", log.category?.toUpperCase(), "]"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-snow/80 break-all", children: log.message })] }, idx));
        }) }));
}
