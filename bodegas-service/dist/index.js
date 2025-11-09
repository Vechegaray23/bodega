"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const bodegasRoutes_1 = __importDefault(require("./routes/bodegasRoutes"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
// Ruta absoluta a la carpeta "public" (donde está el build de React)
const publicPath = path_1.default.join(__dirname, '../public');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir archivos estáticos del front (build de React)
app.use(express_1.default.static(publicPath));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/bodegas', bodegasRoutes_1.default);
// Fallback para frontend (SPA): cualquier otra ruta devuelve index.html
app.get(/.*/, (_req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
app.listen(port, () => {
    console.log(`Bodegas service listening on port ${port}`);
});
