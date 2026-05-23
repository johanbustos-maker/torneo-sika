const fs = require('fs');
const path = require('path');

// Usamos la carpeta temporal /tmp porque Vercel solo permite escribir datos ahí
const DATA_FILE = '/tmp/maestros.json';

function inicializarDatos() {
    if (!fs.existsSync(DATA_FILE)) {
        const listaInicial = [
            { id: "1", nombre: "ESTEFANIA TINJACA", total: 0 },
            { id: "2", nombre: "JOHAN BUSTOS PUENTES", total: 0 },
            { id: "3", nombre: "JUAN CARLOS RINCON", total: 0 }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(listaInicial, null, 2));
    }
}

module.exports = (req, res) => {
    inicializarDatos();
    
    // Manejar la petición GET (obtener maestros ordenados)
    if (req.method === 'GET') {
        const maestros = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const ordenados = [...maestros].sort((a, b) => b.total - a.total);
        return res.status(200).json(ordenados);
    }

    // Manejar la petición POST (sumar puntos)
    if (req.method === 'POST') {
        const { id, puntos } = req.body;
        let maestros = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const maestro = maestros.find(m => m.id === id);
        
        if (maestro) {
            maestro.total += parseInt(puntos);
            fs.writeFileSync(DATA_FILE, JSON.stringify(maestros, null, 2));
            return res.status(200).json({ success: true, maestro });
        } else {
            return res.status(404).json({ success: false, message: "No encontrado" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
};
