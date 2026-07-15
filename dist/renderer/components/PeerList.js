"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PeerList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function PeerList({ peers, selectedPeerId, setSelectedPeerId, onVerifyFingerprint, peerTrustStates }) {
    const [manualIp, setManualIp] = (0, react_1.useState)('');
    const [manualPort, setManualPort] = (0, react_1.useState)('50001');
    const [showManualForm, setShowManualForm] = (0, react_1.useState)(false);
    const handleManualConnect = (e) => {
        e.preventDefault();
        if (!manualIp.trim())
            return;
        window.api.manualConnect(manualIp.trim(), parseInt(manualPort));
        setManualIp('');
        setShowManualForm(false);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected': return (0, jsx_runtime_1.jsx)(lucide_react_1.SignalHigh, { className: "w-3.5 h-3.5 text-steady-green flex-shrink-0" });
            case 'relaying': return (0, jsx_runtime_1.jsx)(lucide_react_1.Signal, { className: "w-3.5 h-3.5 text-relay-blue flex-shrink-0" });
            case 'searching': return (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-3.5 h-3.5 text-fog animate-pulse flex-shrink-0" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3.5 h-3.5 text-caution-red flex-shrink-0" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedPeerId('broadcast'), className: `broadcast-card ${selectedPeerId === 'broadcast' ? 'selected' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 min-w-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Radio, { className: "w-4 h-4 text-amber-sos flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-xs text-snow", children: "ALL PEERS (BROADCAST)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog font-mono", children: "Floods network \u00B7 SOS Net" })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "badge-status status-online flex-shrink-0", children: "ALL" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center px-1 mt-1", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] font-semibold text-fog uppercase tracking-wider", children: ["Nearby Devices (", peers.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowManualForm(!showManualForm), className: "text-[10px] text-relay-blue hover:text-white flex items-center gap-1 cursor-pointer transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3 h-3" }), "MANUAL", showManualForm ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-3 h-3" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3" })] })] }), showManualForm && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleManualConnect, className: "flex flex-col gap-2 p-2.5 bg-slate-base/50 rounded-lg border border-slate-light/50", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog font-mono", children: "Direct IP connection:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1.5", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "192.168.x.x", value: manualIp, onChange: e => setManualIp(e.target.value), className: "input text-xs py-1.5 px-2", style: { flex: 2 }, required: true }), (0, jsx_runtime_1.jsx)("input", { type: "number", placeholder: "Port", value: manualPort, onChange: e => setManualPort(e.target.value), className: "input text-xs py-1.5 px-2", style: { flex: 1, minWidth: 0 }, required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary py-1.5 text-xs", children: "Connect" })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-1 overflow-y-auto", style: { maxHeight: '280px' }, children: peers.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-6 text-[10px] text-fog font-mono flex flex-col items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 rounded-full border-2 border-fog/40 border-t-fog animate-spin" }), "Scanning for nearby devices..."] })) : (peers.map(peer => {
                    const trust = peerTrustStates[peer.id];
                    const isConnected = peer.status === 'connected';
                    return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedPeerId(peer.id), className: `peer-card ${selectedPeerId === peer.id ? 'selected' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [getStatusIcon(peer.status), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-xs text-snow truncate max-w-[110px]", children: peer.displayName }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[9px] text-fog font-mono truncate", children: [peer.id.substring(0, 8), " \u00B7 ", peer.address] })] })] }), isConnected && ((0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    onVerifyFingerprint(peer.id);
                                }, className: "opacity-70 hover:opacity-100 transition-opacity p-0.5", title: trust?.trusted ? "Identity Verified" : "Identity Unverified — Compare fingerprints", children: trust?.trusted ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { className: "w-3.5 h-3.5 text-steady-green flex-shrink-0" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-3.5 h-3.5 text-amber-sos flex-shrink-0" })) })), (0, jsx_runtime_1.jsx)("span", { className: `badge-status status-${peer.status} flex-shrink-0 ml-1`, children: peer.status === 'connected' ? 'ON'
                                    : peer.status === 'relaying' ? 'REL'
                                        : peer.status === 'searching' ? '...'
                                            : 'OFF' })] }, peer.id));
                })) })] }));
}
