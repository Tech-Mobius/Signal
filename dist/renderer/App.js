"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const MeshGraph_1 = __importDefault(require("./components/MeshGraph"));
const ChatPanel_1 = __importDefault(require("./components/ChatPanel"));
const PeerList_1 = __importDefault(require("./components/PeerList"));
const StatusBoard_1 = __importDefault(require("./components/StatusBoard"));
const DebugPanel_1 = __importDefault(require("./components/DebugPanel"));
const UsernamePrompt_1 = __importDefault(require("./components/UsernamePrompt"));
const VerificationModal_1 = __importDefault(require("./components/VerificationModal"));
const SettingsPanel_1 = __importDefault(require("./components/SettingsPanel"));
const FaultyTerminal_1 = __importDefault(require("./components/FaultyTerminal"));
const AsciiArt_1 = require("./components/AsciiArt");
const useIdentity_1 = require("./hooks/useIdentity");
const usePeers_1 = require("./hooks/usePeers");
const useCrypto_1 = require("./hooks/useCrypto");
const useMessages_1 = require("./hooks/useMessages");
const useWebRTC_1 = require("./hooks/useWebRTC");
// Synthesize S-O-S in Morse Code using Web Audio API
function playSosBeeps() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass)
            return;
        const context = new AudioContextClass();
        const playBeep = (freq, duration, delay) => {
            const osc = context.createOscillator();
            const gainNode = context.createGain();
            osc.connect(gainNode);
            gainNode.connect(context.destination);
            osc.frequency.setValueAtTime(freq, context.currentTime + delay);
            gainNode.gain.setValueAtTime(0.3, context.currentTime + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + delay + duration);
            osc.start(context.currentTime + delay);
            osc.stop(context.currentTime + delay + duration);
        };
        const shortDur = 0.12;
        const longDur = 0.35;
        const gap = 0.15;
        let t = 0;
        for (let i = 0; i < 3; i++) {
            playBeep(880, shortDur, t);
            t += shortDur + gap;
        }
        t += gap;
        for (let i = 0; i < 3; i++) {
            playBeep(880, longDur, t);
            t += longDur + gap;
        }
        t += gap;
        for (let i = 0; i < 3; i++) {
            playBeep(880, shortDur, t);
            t += shortDur + gap;
        }
    }
    catch (e) {
        console.error('AudioContext synth error:', e);
    }
}
function App() {
    const [selectedPeerId, setSelectedPeerId] = (0, react_1.useState)('broadcast');
    const [sosActive, setSosActive] = (0, react_1.useState)(false);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const [verificationPeer, setVerificationPeer] = (0, react_1.useState)(null);
    const [peerTrustStates, setPeerTrustStates] = (0, react_1.useState)({});
    // 1. Logs & Console states
    const addLog = (category, message) => {
        setMessagesHook.setDebugLogs(prev => [
            { timestamp: Date.now(), level: 'info', category, message },
            ...prev
        ].slice(0, 200));
    };
    // 2. Load Identity & Key Hooks
    const identityHook = (0, useIdentity_1.useIdentity)();
    const peersHook = (0, usePeers_1.usePeers)();
    const cryptoHook = (0, useCrypto_1.useCrypto)(addLog);
    const setMessagesHook = (0, useMessages_1.useMessages)(identityHook.identity?.peerId || '', identityHook.identity?.username || '', addLog, playSosBeeps, setSosActive, cryptoHook.decryptPayload);
    // 3. WebRTC Manager Hook
    const webrtcHook = (0, useWebRTC_1.useWebRTC)({
        peerId: identityHook.identity?.peerId || '',
        displayName: identityHook.identity?.username || '',
        addLog,
        onHandshakeReceived: async (targetId, publicKeyJwk) => {
            await cryptoHook.processHandshake(targetId, publicKeyJwk);
            // Auto-fetch and trust check peer fingerprint
            if (window.api) {
                const finger = await window.api.getPeerFingerprint(targetId);
                if (finger) {
                    setPeerTrustStates(prev => ({
                        ...prev,
                        [targetId]: { fingerprint: finger.fingerprint, trusted: finger.trusted }
                    }));
                }
            }
        },
        onMeshMessageReceived: async (encryptedMsg) => {
            if (window.api)
                window.api.webrtcReceived({ message: encryptedMsg });
        },
        onFileReceived: (fileMsg) => {
            if (window.api)
                window.api.webrtcReceived({ message: fileMsg });
        }
    });
    // 4. WebRTC Connection State Machine loop
    (0, react_1.useEffect)(() => {
        if (!identityHook.identity || peersHook.isOffline)
            return;
        peersHook.peers.forEach(async (peer) => {
            if (peer.status === 'searching') {
                if (identityHook.identity && identityHook.identity.peerId < peer.id) {
                    addLog('WebRTC', `Initiating connection to ${peer.displayName}`);
                    webrtcHook.initiateWebRTCConnection(peer, cryptoHook.getHandshakeData);
                }
            }
            else if (peer.status === 'offline') {
                webrtcHook.cleanupPeerConnection(peer.id);
            }
        });
    }, [peersHook.peers, identityHook.identity, peersHook.isOffline]);
    // 5. Handle incoming signaling messages forwarded from Main process
    (0, react_1.useEffect)(() => {
        if (!window.api)
            return;
        const unsubMsg = window.api.onMessageReceived(async (msg) => {
            if (msg.type === 'signal') {
                const payload = JSON.parse(msg.payload);
                webrtcHook.handleIncomingSignal(payload, cryptoHook.getHandshakeData);
            }
            else if (msg.type === 'signal-manual-initiate') {
                const payload = JSON.parse(msg.payload);
                webrtcHook.initiateWebRTCConnection({
                    id: payload.tempId,
                    displayName: `Peer @ ${payload.address}`,
                    address: payload.address,
                    port: payload.port
                }, cryptoHook.getHandshakeData);
            }
        });
        const unsubSend = window.api.onWebrtcSend(({ peerId, message }) => {
            webrtcHook.webrtcSendPacket(peerId, message, cryptoHook.encryptPayload);
        });
        return () => {
            unsubMsg();
            unsubSend();
        };
    }, [identityHook.identity, webrtcHook, cryptoHook]);
    const handleSendMessage = (text, type = 'text') => {
        if (!identityHook.identity)
            return;
        // Check E2E verification warn if destination is not trusted direct peer
        if (selectedPeerId !== 'broadcast') {
            const trust = peerTrustStates[selectedPeerId];
            if (trust && !trust.trusted) {
                addLog('Security', `Warning: Sending encrypted message to unverified peer ${selectedPeerId}`);
            }
        }
        if (window.api) {
            window.api.sendMessage(selectedPeerId, type, text);
        }
        const localMsg = {
            id: crypto.randomUUID(),
            senderId: identityHook.identity.peerId,
            senderName: identityHook.identity.username,
            recipientId: selectedPeerId,
            type,
            payload: text,
            timestamp: Date.now(),
            hops: 0,
            ttl: 5,
            visitedNodes: [identityHook.identity.peerId],
            priority: type === 'sos' ? 1 : 0
        };
        setMessagesHook.addLocalMessage(localMsg);
        if (type === 'sos') {
            setSosActive(true);
            setTimeout(() => setSosActive(false), 6000);
            playSosBeeps();
        }
    };
    const handleSendFile = (file) => {
        if (selectedPeerId === 'broadcast')
            return;
        webrtcHook.webrtcSendFile(selectedPeerId, file, (fileMsg) => {
            setMessagesHook.addLocalMessage(fileMsg);
            if (window.api)
                window.api.webrtcReceived({ message: fileMsg });
        });
    };
    const showVerificationModal = async (targetId) => {
        const peer = peersHook.peers.find(p => p.id === targetId);
        if (!peer || !window.api)
            return;
        const finger = await window.api.getPeerFingerprint(targetId);
        if (finger) {
            setVerificationPeer({
                id: targetId,
                displayName: peer.displayName,
                fingerprint: finger.fingerprint,
                trusted: finger.trusted
            });
        }
    };
    const handleTrustPeer = () => {
        if (!verificationPeer)
            return;
        peersHook.trustFingerprint(verificationPeer.id, verificationPeer.fingerprint, verificationPeer.displayName);
        setPeerTrustStates(prev => ({
            ...prev,
            [verificationPeer.id]: { ...prev[verificationPeer.id], trusted: true }
        }));
        setVerificationPeer(null);
    };
    const showPrompt = identityHook.identity && !identityHook.identity.username;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen", style: { position: 'relative' }, children: [sosActive && (0, jsx_runtime_1.jsx)("div", { className: "sos-ring-overlay" }), (0, jsx_runtime_1.jsxs)("div", { style: { position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }, children: [(0, jsx_runtime_1.jsx)(FaultyTerminal_1.default, { scale: 1.2, gridMul: [2, 1.5], digitSize: 1.4, timeScale: 0.35, pause: false, scanlineIntensity: 0.18, glitchAmount: 0.08, flickerAmount: 0.03, noiseAmp: 0.01, chromaticAberration: 0.8, curvature: 0.15, tint: "#4A9B6E", mouseReact: true, mouseStrength: 0.3, pageLoadAnimation: true, brightness: 0.85 }), (0, jsx_runtime_1.jsx)("div", { style: { position: 'absolute', inset: 0, zIndex: 1, opacity: 1, mixBlendMode: 'normal', pointerEvents: 'none' }, children: (0, jsx_runtime_1.jsx)(AsciiArt_1.AsciiArt, { className: "h-full w-full" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "title-bar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "title-bar-identity", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "w-4 h-4 text-amber-sos" }), (0, jsx_runtime_1.jsx)("span", { className: "title-bar-logo", children: "SIGNUM" }), identityHook.identity && ((0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] text-fog font-mono ml-3 hidden xl:block", children: ["NODE: ", identityHook.identity.peerId, " \u00B7 ", identityHook.identity.username || 'ANON'] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [peersHook.isOffline && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-[10px] text-caution-red font-mono px-2 py-0.5 border border-caution-red/30 rounded bg-caution-red/10", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-3 h-3" }), "SIMULATED OFFLINE"] })), (0, jsx_runtime_1.jsxs)("div", { className: "title-bar-controls", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSettings(true), className: "title-bar-btn", title: "Open Configurations", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => peersHook.toggleOffline(!peersHook.isOffline), className: `title-bar-btn ${peersHook.isOffline ? 'text-caution-red' : 'text-steady-green'}`, title: peersHook.isOffline ? 'Connect to Mesh' : 'Go Offline (Simulate)', children: peersHook.isOffline ? (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-3.5 h-3.5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-slate-light mx-1" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.api?.minimizeWindow(), className: "win-btn", title: "Minimize", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.api?.maximizeWindow(), className: "win-btn", title: "Maximize / Restore", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Square, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.api?.closeWindow(), className: "win-btn win-close", title: "Close", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3.5 h-3.5" }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "app-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel-header", children: [(0, jsx_runtime_1.jsx)("span", { children: "MESH PARTICIPANTS" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Radio, { className: "w-4 h-4 text-fog" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel-content flex flex-col gap-3", children: [(0, jsx_runtime_1.jsx)(PeerList_1.default, { peers: peersHook.peers, selectedPeerId: selectedPeerId, setSelectedPeerId: setSelectedPeerId, onVerifyFingerprint: showVerificationModal, peerTrustStates: peerTrustStates }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-slate-light pt-3 mt-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-[10px] font-semibold text-fog mb-2 uppercase tracking-wider", children: "Safety Status Board" }), (0, jsx_runtime_1.jsx)(StatusBoard_1.default, { statuses: setMessagesHook.statuses, onCheckIn: setMessagesHook.updateStatus })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel-header", children: [(0, jsx_runtime_1.jsx)("span", { children: selectedPeerId === 'broadcast'
                                            ? 'BROADCAST & SOS NET'
                                            : `SECURE CHANNEL · ${peersHook.peers.find(p => p.id === selectedPeerId)?.displayName || selectedPeerId}` }), (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-4 h-4 text-fog" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col min-h-0 p-0", children: (0, jsx_runtime_1.jsx)(ChatPanel_1.default, { messages: setMessagesHook.messages.filter(m => selectedPeerId === 'broadcast'
                                        ? m.recipientId === 'broadcast'
                                        : (m.senderId === selectedPeerId && m.recipientId === identityHook.identity?.peerId) ||
                                            (m.senderId === identityHook.identity?.peerId && m.recipientId === selectedPeerId)), recipientId: selectedPeerId, onSendMessage: handleSendMessage, onSendFile: handleSendFile, ourPeerId: identityHook.identity?.peerId || '' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel-header", children: [(0, jsx_runtime_1.jsx)("span", { children: "LIVE TOPOLOGY" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-4 h-4 text-fog" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-h-0", style: { height: '60%', maxHeight: '60%' }, children: (0, jsx_runtime_1.jsx)(MeshGraph_1.default, { peers: peersHook.peers, ourId: identityHook.identity?.peerId || '', messages: setMessagesHook.messages }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col overflow-hidden border-t border-slate-light", style: { height: '40%' }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panel-header py-1 text-[10px]", children: (0, jsx_runtime_1.jsx)("span", { children: "DEBUG / ROUTING LOG" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-3 bg-slate-base/30 min-h-0", children: (0, jsx_runtime_1.jsx)(DebugPanel_1.default, { logs: setMessagesHook.debugLogs }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "status-bar", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${peersHook.isOffline ? 'bg-caution-red' : 'bg-steady-green'} animate-pulse` }), peersHook.isOffline ? 'MESH DISCONNECTED' : 'ACTIVE MESH DISCOVERY'] }), identityHook.identity && ((0, jsx_runtime_1.jsxs)("span", { className: "font-mono text-[10px]", children: [identityHook.identity.address, ":", identityHook.identity.port, " \u00B7 PEERS: ", peersHook.peers.filter(p => p.status === 'connected').length] }))] }), showPrompt && ((0, jsx_runtime_1.jsx)(UsernamePrompt_1.default, { onSave: (name) => identityHook.setUsername(name) })), verificationPeer && ((0, jsx_runtime_1.jsx)(VerificationModal_1.default, { peerId: verificationPeer.id, displayName: verificationPeer.displayName, fingerprint: verificationPeer.fingerprint, isTrusted: verificationPeer.trusted, onClose: () => setVerificationPeer(null), onTrust: handleTrustPeer })), showSettings && ((0, jsx_runtime_1.jsx)(SettingsPanel_1.default, { currentUsername: identityHook.identity?.username || '', ourFingerprint: identityHook.fingerprint, onSaveUsername: (name) => identityHook.setUsername(name), onExportIdentity: identityHook.exportBackup, onImportIdentity: identityHook.importBackup, onClose: () => setShowSettings(false) }))] }));
}
