"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePeers = usePeers;
const react_1 = require("react");
function usePeers() {
    const [peers, setPeers] = (0, react_1.useState)([]);
    const [isOffline, setIsOffline] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!window.api)
            return;
        // Load initial offline state
        const unsubSim = window.api.onSimStatusUpdated((status) => {
            setIsOffline(status.offline);
        });
        // Handle peer list updates from discovery
        const unsubPeers = window.api.onPeerListUpdated((list) => {
            setPeers(list);
        });
        return () => {
            unsubSim();
            unsubPeers();
        };
    }, []);
    const manualConnect = (address, port) => {
        if (!window.api)
            return;
        window.api.manualConnect(address, port);
    };
    const toggleOffline = (offline) => {
        if (!window.api)
            return;
        window.api.toggleOffline(offline);
        setIsOffline(offline);
    };
    const verifyFingerprint = async (peerId, fingerprint, displayName) => {
        if (!window.api)
            return { verified: false, trusted: false, fingerprint: '' };
        return await window.api.verifyPeerFingerprint(peerId, fingerprint, displayName);
    };
    const trustFingerprint = (peerId, fingerprint, displayName) => {
        if (!window.api)
            return;
        window.api.trustPeerFingerprint(peerId, fingerprint, displayName);
    };
    const getPeerFingerprint = async (peerId) => {
        if (!window.api)
            return null;
        return await window.api.getPeerFingerprint(peerId);
    };
    return {
        peers,
        isOffline,
        manualConnect,
        toggleOffline,
        verifyFingerprint,
        trustFingerprint,
        getPeerFingerprint,
    };
}
