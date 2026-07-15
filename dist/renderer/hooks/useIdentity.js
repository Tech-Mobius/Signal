"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIdentity = useIdentity;
const react_1 = require("react");
function useIdentity() {
    const [identity, setIdentity] = (0, react_1.useState)(null);
    const [fingerprint, setFingerprint] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        // Check if running in Electron
        if (!window.api) {
            setLoading(false);
            return;
        }
        async function loadIdentity() {
            try {
                const id = await window.api.getIdentity();
                setIdentity(id);
                const fp = await window.api.getFingerprint();
                setFingerprint(fp);
            }
            catch (err) {
                console.error('Failed to load identity info:', err);
            }
            finally {
                setLoading(false);
            }
        }
        loadIdentity();
    }, []);
    const setUsername = (username) => {
        if (!window.api)
            return;
        window.api.setUsername(username);
        // Reload identity
        window.api.getIdentity().then(setIdentity);
    };
    const exportBackup = async (passphrase) => {
        if (!window.api)
            throw new Error('Electron context not available');
        return await window.api.exportIdentity(passphrase);
    };
    const importBackup = async (backupData, passphrase) => {
        if (!window.api)
            throw new Error('Electron context not available');
        const res = await window.api.importIdentity(backupData, passphrase);
        // Reload identity
        const id = await window.api.getIdentity();
        setIdentity(id);
        setFingerprint(res.fingerprint);
        return res.fingerprint;
    };
    return {
        identity,
        fingerprint,
        loading,
        setUsername,
        exportBackup,
        importBackup,
    };
}
