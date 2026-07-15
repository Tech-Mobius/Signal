"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function ChatPanel({ messages, recipientId, onSendMessage, onSendFile, ourPeerId }) {
    const [inputText, setInputText] = (0, react_1.useState)('');
    const [showSosModal, setShowSosModal] = (0, react_1.useState)(false);
    const [sosText, setSosText] = (0, react_1.useState)('');
    const fileInputRef = (0, react_1.useRef)(null);
    const messageListRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    // Scroll to bottom when new messages arrive
    (0, react_1.useEffect)(() => {
        const el = messageListRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);
    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim())
            return;
        onSendMessage(inputText.trim(), 'text');
        setInputText('');
        inputRef.current?.focus();
    };
    const handleSosConfirm = () => {
        if (!sosText.trim())
            return;
        onSendMessage(sosText.trim(), 'sos');
        setSosText('');
        setShowSosModal(false);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            // Show inline error in log instead of alert
            console.warn('File size exceeds 5MB limit.');
            return;
        }
        onSendFile(file);
        // Reset input so same file can be re-selected
        e.target.value = '';
    };
    const formatBytes = (bytes) => {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "chat-container", children: [(0, jsx_runtime_1.jsx)("div", { ref: messageListRef, className: "message-list", children: messages.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50", children: [(0, jsx_runtime_1.jsx)(RadioWaveIcon, {}), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-fog font-mono mt-2 leading-relaxed max-w-[220px]", children: recipientId === 'broadcast'
                                        ? 'SOS & Broadcast channel.\nMessages flood all nearby mesh nodes.'
                                        : 'Direct secure channel.\nAll messages are E2E encrypted (ECDH + AES-GCM).' })] })) : (messages.map((msg) => {
                            const isSelf = msg.senderId === ourPeerId;
                            const isSos = msg.type === 'sos';
                            const isFile = msg.type === 'file';
                            return ((0, jsx_runtime_1.jsxs)("div", { className: `message-bubble-wrapper ${isSelf ? 'self' : 'peer'} ${isSos ? 'sos' : ''}`, children: [!isSelf && ((0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-fog font-semibold mb-0.5 px-1 font-mono", children: msg.senderName || `Node:${msg.senderId?.substring(0, 6)}` })), (0, jsx_runtime_1.jsxs)("div", { className: "message-bubble", children: [isSos && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 mb-1 text-amber-sos text-[11px] font-bold uppercase tracking-wider", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3.5 h-3.5" }), "SOS ALERT"] })), isFile && msg.attachmentMeta ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 bg-slate-base/50 rounded border border-slate-light/50", children: [msg.attachmentMeta.fileType?.startsWith('image/')
                                                                ? (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-4 h-4 text-relay-blue flex-shrink-0" })
                                                                : (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-fog flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-semibold truncate text-snow", children: msg.attachmentMeta.fileName }), (0, jsx_runtime_1.jsx)("div", { className: "text-[9px] text-fog font-mono", children: formatBytes(msg.attachmentMeta.fileSize) })] })] }), msg.attachmentMeta.fileType?.startsWith('image/') && ((0, jsx_runtime_1.jsx)("img", { src: msg.payload, alt: "Attachment", className: "max-w-full max-h-[160px] object-contain rounded border border-slate-light" })), (0, jsx_runtime_1.jsx)("a", { href: msg.payload, download: msg.attachmentMeta.fileName, className: "text-xs text-relay-blue hover:text-white font-semibold underline", children: "\u2193 Save File" })] })) : ((0, jsx_runtime_1.jsx)("span", { children: msg.payload }))] }), (0, jsx_runtime_1.jsxs)("div", { className: `message-meta ${isSelf ? 'justify-end' : ''}`, children: [(0, jsx_runtime_1.jsx)("span", { children: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }), (0, jsx_runtime_1.jsx)("span", { children: "\u00B7" }), (0, jsx_runtime_1.jsx)("span", { className: msg.hops === 0 ? 'text-steady-green' : 'text-relay-blue', children: msg.hops === 0 ? 'Direct' : `${msg.hops}-hop relay` }), msg.encrypted && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u00B7" }), (0, jsx_runtime_1.jsx)("span", { className: "text-relay-blue", children: "\uD83D\uDD12 E2E" })] }))] })] }, msg.id));
                        })) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 p-2.5 bg-slate-base/50 border-t border-slate-light", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSend, className: "flex gap-2 items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: `btn px-2.5 py-2 flex-shrink-0 ${recipientId === 'broadcast' ? 'opacity-30 cursor-not-allowed' : 'hover:border-fog'}`, title: recipientId === 'broadcast' ? 'Attachments not available in Broadcast mode' : 'Attach File (<5MB)', disabled: recipientId === 'broadcast', children: (0, jsx_runtime_1.jsx)(lucide_react_1.Paperclip, { className: "w-4 h-4 text-fog" }) }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", placeholder: recipientId === 'broadcast'
                                        ? 'Broadcast message to all peers...'
                                        : 'Send encrypted direct message...', value: inputText, onChange: e => setInputText(e.target.value), className: "input flex-1 py-2 px-3 text-sm" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary px-3 py-2 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setShowSosModal(true), className: "btn btn-sos px-3 py-2 flex-shrink-0 flex items-center gap-1", title: "Send Emergency SOS Alert", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-bold", children: "SOS" })] })] }) })] }), showSosModal && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowSosModal(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content sos-modal", onClick: e => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-9 h-9 rounded-full bg-amber-sos/15 border border-amber-sos/30 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-5 h-5 text-amber-sos" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-bold text-snow uppercase tracking-wide", children: "Emergency SOS Broadcast" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-fog font-mono", children: "Floods ALL mesh nodes in range" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSosModal(false), className: "title-bar-btn", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-amber-sos/70 font-mono bg-amber-sos/5 border border-amber-sos/20 rounded p-2.5 leading-relaxed", children: "\u26A0 This message will be sent as an urgent SOS to ALL connected peers with priority routing and Morse code alert beeps." }), (0, jsx_runtime_1.jsx)("textarea", { autoFocus: true, placeholder: "Describe the emergency (e.g. MEDICAL EMERGENCY AT BUILDING C, NEED IMMEDIATE HELP)", value: sosText, onChange: e => setSosText(e.target.value), onKeyDown: e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSosConfirm();
                                }
                            }, className: "input resize-none text-sm", rows: 3, style: { userSelect: 'text', WebkitUserSelect: 'text' } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSosModal(false), className: "btn flex-1 py-2", children: "Cancel" }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleSosConfirm, disabled: !sosText.trim(), className: "btn btn-danger flex-1 py-2 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "w-4 h-4" }), "BROADCAST SOS"] })] })] }) }))] }));
}
function RadioWaveIcon() {
    return ((0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 opacity-40 animate-pulse", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M13 10V3L4 14h7v7l9-11h-7z" }) }));
}
