const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'maestros.json');

// Inicializa la base de datos si no existe
if (!fs.existsSync(DATA_FILE)) {
    const listaInicial = [
        { id: "1", nombre: "ESTEFANIA TINJACA", total: 0 },
        { id: "2", nombre: "JOHAN BUSTOS PUENTES", total: 0 },
        { id: "3", nombre: "JUAN CARLOS RINCON", total: 0 }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(listaInicial, null, 2));
}

function obtenerBaseDatos() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function actualizarBaseDatos(datos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2));
}

// API para entregar los datos en tiempo real ordenados
app.get('/api/maestros', (req, res) => {
    try {
        const maestros = obtenerBaseDatos();
        const ordenados = [...maestros].sort((a, b) => b.total - a.total);
        res.json(ordenados);
    } catch (e) {
        res.status(500).json({ error: "Error leyendo datos" });
    }
});

// API para sumar los puntos con incrementos estrictos
app.post('/api/sumar-puntos', (req, res) => {
    const { id, puntos } = req.body;
    let maestros = obtenerBaseDatos();
    const maestro = maestros.find(m => m.id === id);
    
    if (maestro) {
        maestro.total += parseInt(puntos);
        actualizarBaseDatos(maestros);
        res.json({ success: true, maestro });
    } else {
        res.status(404).json({ success: false, message: "No encontrado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Sika corriendo en puerto ${PORT}`);
});
