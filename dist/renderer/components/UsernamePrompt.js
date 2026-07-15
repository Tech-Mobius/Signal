"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsernamePrompt;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function UsernamePrompt({ onSave }) {
    const [name, setName] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter a callsign.');
            return;
        }
        if (trimmed.length < 2) {
            setError('Callsign must be at least 2 characters.');
            return;
        }
        onSave(trimmed);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-1", children: (0, jsx_runtime_1.jsx)("div", { className: "w-14 h-14 rounded-full bg-amber-sos/10 border border-amber-sos/30 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-7 h-7 text-amber-sos animate-pulse" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-bold text-snow uppercase tracking-widest", children: "Initialize Node Identity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[11px] text-fog leading-relaxed mt-1 max-w-[300px] mx-auto", children: "Welcome to the Signum mesh network. Choose a callsign to identify your node on the local emergency grid." })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex flex-col gap-3 mt-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Callsign (e.g. Alpha, Base-7, Alice)", value: name, onChange: e => { setName(e.target.value); setError(''); }, className: "input text-center text-sm py-2.5", style: { userSelect: 'text', WebkitUserSelect: 'text' }, maxLength: 20, autoFocus: true, required: true }), error && ((0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-caution-red font-mono", children: error })), (0, jsx_runtime_1.jsxs)("button", { type: "submit", className: "btn btn-primary py-2.5 font-semibold flex items-center justify-center gap-2", children: ["Join Emergency Mesh ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-[9px] font-mono text-fog/50 mt-2", children: "Offline P2P \u00B7 No internet required \u00B7 E2E Encrypted" })] }) }));
}
