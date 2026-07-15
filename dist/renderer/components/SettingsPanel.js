"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const qrcode_1 = __importDefault(require("qrcode"));
const lucide_react_1 = require("lucide-react");
function SettingsPanel({ currentUsername, ourFingerprint, onSaveUsername, onExportIdentity, onImportIdentity, onClose }) {
    const [username, setUsername] = (0, react_1.useState)(currentUsername);
    const [turnHost, setTurnHost] = (0, react_1.useState)('');
    const [turnPort, setTurnPort] = (0, react_1.useState)('443');
    const [turnUser, setTurnUser] = (0, react_1.useState)('');
    const [turnCred, setTurnCred] = (0, react_1.useState)('');
    // Backup / Export
    const [exportPass, setExportPass] = (0, react_1.useState)('');
    const [exportString, setExportString] = (0, react_1.useState)('');
    const [copied, setCopied] = (0, react_1.useState)(false);
    const canvasRef = (0, react_1.useRef)(null);
    // Restore / Import
    const [importString, setImportString] = (0, react_1.useState)('');
    const [importPass, setImportPass] = (0, react_1.useState)('');
    const [importError, setImportError] = (0, react_1.useState)('');
    const [importSuccess, setImportSuccess] = (0, react_1.useState)('');
    // Load existing TURN config
    (0, react_1.useEffect)(() => {
        if (!window.api)
            return;
        window.api.getTurnConfig().then((config) => {
            setTurnHost(config.hostname);
            setTurnPort(config.port.toString());
            setTurnUser(config.username);
            setTurnCred(config.credential);
        });
    }, []);
    // Generate QR Code when export string changes
    (0, react_1.useEffect)(() => {
        if (exportString && canvasRef.current) {
            qrcode_1.default.toCanvas(canvasRef.current, exportString, { width: 180, margin: 2 }, (err) => {
                if (err)
                    console.error('[Settings] QR code generation failed:', err);
            });
        }
    }, [exportString]);
    const handleSaveUsername = (e) => {
        e.preventDefault();
        if (!username.trim())
            return;
        onSaveUsername(username.trim());
    };
    const handleSaveTurn = (e) => {
        e.preventDefault();
        if (!window.api)
            return;
        window.api.setTurnConfig({
            hostname: turnHost.trim(),
            port: parseInt(turnPort),
            username: turnUser.trim(),
            credential: turnCred.trim()
        });
    };
    const handleExportKeys = async (e) => {
        e.preventDefault();
        if (!exportPass)
            return;
        try {
            const data = await onExportIdentity(exportPass);
            setExportString(data);
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleImportKeys = async (e) => {
        e.preventDefault();
        if (!importString.trim() || !importPass)
            return;
        setImportError('');
        setImportSuccess('');
        try {
            const fingerprint = await onImportIdentity(importString.trim(), importPass);
            setImportSuccess(`Identity imported! New fingerprint: ${fingerprint}`);
            setImportString('');
            setImportPass('');
        }
        catch (err) {
            setImportError('Failed to decrypt backup. Check passphrase or data.');
        }
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(exportString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content max-w-lg w-full flex flex-col gap-4 overflow-y-auto max-h-[90vh]", onClick: e => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center border-b border-slate-light pb-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-bold text-snow uppercase tracking-wider", children: "Node Configurations" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "title-bar-btn", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSaveUsername, className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog font-semibold uppercase tracking-wider", children: "Callsign Identity" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), className: "input text-xs py-1.5", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary text-xs py-1.5 px-3", children: "Update Name" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[9px] text-fog font-mono", children: ["Fingerprint: ", ourFingerprint || 'Unknown'] })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSaveTurn, className: "flex flex-col gap-2 border-t border-slate-light pt-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-[10px] text-fog font-semibold uppercase tracking-wider", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-3.5 h-3.5" }), "STUN / TURN Routing (NAT Traversal)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-fog font-mono", children: "TURN Host" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: turnHost, onChange: e => setTurnHost(e.target.value), placeholder: "openrelay.metered.ca", className: "input text-xs py-1" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-fog font-mono", children: "TURN Port" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: turnPort, onChange: e => setTurnPort(e.target.value), placeholder: "443", className: "input text-xs py-1" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-fog font-mono", children: "TURN Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: turnUser, onChange: e => setTurnUser(e.target.value), placeholder: "openrelayproject", className: "input text-xs py-1" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-fog font-mono", children: "TURN Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", value: turnCred, onChange: e => setTurnCred(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "input text-xs py-1" })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn text-xs py-1.5 mt-1 self-end px-3", children: "Save Server Config" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2 border-t border-slate-light pt-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-[10px] text-fog font-semibold uppercase tracking-wider", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "w-3.5 h-3.5" }), "Backup Identity (QR Export)"] }), !exportString ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleExportKeys, className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Set backup decryption passphrase", value: exportPass, onChange: e => setExportPass(e.target.value), className: "input text-xs py-1.5", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary text-xs py-1.5 px-3", children: "Generate QR" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2.5 p-2.5 bg-slate-base/50 rounded-lg border border-slate-light/40", children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, className: "bg-white rounded p-1" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 w-full", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: copyToClipboard, className: "btn text-xs py-1.5 flex-1 flex items-center justify-center gap-1.5", children: [copied ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-3.5 h-3.5 text-steady-green" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "w-3.5 h-3.5" }), copied ? 'Copied string!' : 'Copy raw string'] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => { setExportString(''); setExportPass(''); }, className: "btn text-xs py-1.5", children: "Reset" })] })] }))] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleImportKeys, className: "flex flex-col gap-2 border-t border-slate-light pt-3 pb-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-fog font-semibold uppercase tracking-wider", children: "Restore / Import Identity" }), (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Paste raw identity backup string...", value: importString, onChange: e => setImportString(e.target.value), className: "input text-xs resize-none", rows: 2, required: true }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Decryption Passphrase", value: importPass, onChange: e => setImportPass(e.target.value), className: "input text-xs py-1.5", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-danger text-xs py-1.5 px-3", children: "Restore keys" })] }), importError && ((0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-caution-red font-mono", children: importError })), importSuccess && ((0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-steady-green font-mono", children: importSuccess }))] })] }) }));
}
