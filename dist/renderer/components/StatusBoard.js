"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusBoard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function StatusBoard({ statuses, onCheckIn }) {
    const [myStatus, setMyStatus] = (0, react_1.useState)('safe');
    const [myLocation, setMyLocation] = (0, react_1.useState)('');
    const handleCheckIn = (e) => {
        e.preventDefault();
        onCheckIn(myStatus, myLocation || undefined);
        setMyLocation('');
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'safe':
                return ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1 text-[10px] text-steady-green font-semibold bg-steady-green/10 px-1.5 py-0.5 rounded border border-steady-green/20 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3" }), " SAFE"] }));
            case 'need-help':
                return ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1 text-[10px] text-amber-sos font-semibold bg-amber-sos/10 px-1.5 py-0.5 rounded border border-amber-sos/20 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3 h-3" }), " HELP"] }));
            default:
                return ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1 text-[10px] text-fog bg-slate-light/50 px-1.5 py-0.5 rounded flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-3 h-3" }), " UNK"] }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2.5", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCheckIn, className: "flex flex-col gap-2 p-2.5 bg-slate-base/40 rounded-lg border border-slate-light/50", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog font-semibold uppercase tracking-wider", children: "My Status" }), (0, jsx_runtime_1.jsxs)("select", { value: myStatus, onChange: e => setMyStatus(e.target.value), className: "input py-1.5 px-2 text-xs", children: [(0, jsx_runtime_1.jsx)("option", { value: "safe", children: "\u2713 I'm Safe" }), (0, jsx_runtime_1.jsx)("option", { value: "need-help", children: "\u26A0 Need Assistance" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Location (e.g. Room 4B, Building C)", value: myLocation, onChange: e => setMyLocation(e.target.value), className: "input py-1.5 px-2 text-xs" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", className: "btn btn-primary py-1.5 text-xs flex items-center justify-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "w-3 h-3" }), " Check-in"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-1 max-h-[200px] overflow-y-auto", children: statuses.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-4 text-[10px] text-fog/60 font-mono italic", children: "No check-ins synced yet." })) : (statuses.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: "status-item flex flex-col gap-0.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-xs text-snow truncate", children: item.display_name }), getStatusBadge(item.status)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center text-[9px] text-fog font-mono", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-0.5 truncate max-w-[160px]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-2.5 h-2.5 flex-shrink-0" }), item.location || 'Not specified'] }), (0, jsx_runtime_1.jsx)("span", { className: "flex-shrink-0", children: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] }, item.peer_id)))) })] }));
}
