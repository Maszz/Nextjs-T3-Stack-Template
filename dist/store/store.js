"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// store/store.js
const zustand_1 = __importDefault(require("zustand"));
const useColorStore = (0, zustand_1.default)((set) => ({
    color: 'white',
    changeColor: () => set((state) => ({ color: state.color === 'white' ? '#212529' : 'white' })),
}));
exports.default = useColorStore;
