const fs = require('fs');
const path = require('path');

// Usamos la carpeta temporal /tmp obligatoria para entornos Serverless en Vercel
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
    
    // 1. OBTENER MAESTROS (GET)
    if (req.method === 'GET') {
        const maestros = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const ordenados = [...maestros].sort((a, b) => b.total - a.total);
        return res.status(200).json(ordenados);
    }

    // 2. PROCESAR ACCIONES (POST)
    if (req.method === 'POST') {
        let maestros = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

        // CASO A: Es un registro de un NUEVO JUGADOR
        if (req.body.nuevoMaestro) {
            const nombreNuevo = req.body.nuevoMaestro.trim().toUpperCase();
            
            // Validar si ya existe para no duplicarlo
            const existe = maestros.some(m => m.nombre === nombreNuevo);
            if (existe) {
                return res.status(200).json({ success: true, message: "Ya registrado" });
            }

            // Generar un ID único incremental consecutivo
            const nuevoId = (maestros.length > 0) ? (Math.max(...maestros.map(m => parseInt(m.id))) + 1).toString() : "1";
            
            const nuevoObjeto = {
                id: nuevoId,
                nombre: nombreNuevo,
                total: 0
            };

            maestros.push(nuevoObjeto);
            fs.writeFileSync(DATA_FILE, JSON.stringify(maestros, null, 2));
            return res.status(200).json({ success: true, maestro: nuevoObjeto });
        }

        // CASO B: Es una carga normal de PUNTOS
        const { id, puntos } = req.body;
        const maestro = maestros.find(m => m.id === id);
        
        if (maestro) {
            maestro.total += parseInt(puntos);
            fs.writeFileSync(DATA_FILE, JSON.stringify(maestros, null, 2));
            return res.status(200).json({ success: true, maestro });
        } else {
            return res.status(404).json({ success: false, message: "Maestro no encontrado" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
};
