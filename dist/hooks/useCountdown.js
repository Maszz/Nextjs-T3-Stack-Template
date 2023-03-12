"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCountdown = void 0;
const react_1 = __importDefault(require("react"));
function useCountdown(seconds, onEnd) {
    const [remaining, setRemaining] = react_1.default.useState(seconds);
    const [t, setT] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        function tick() {
            setRemaining((prev) => {
                if (prev <= 0) {
                    return prev;
                }
                return prev - 1;
            });
        }
        const countdown = setInterval(tick, 1000);
        if (remaining <= 0) {
            clearInterval(countdown);
            onEnd();
        }
        return () => clearInterval(countdown);
    }, [remaining]);
    return remaining;
}
exports.useCountdown = useCountdown;
