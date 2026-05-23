// Memoria volátil global que mantendrá los datos vivos mientras la función responda
let memoriaMaestros = [
    { id: "1", nombre: "ESTEFANIA TINJACA", total: 0 },
    { id: "2", nombre: "JOHAN BUSTOS PUENTES", total: 0 },
    { id: "3", nombre: "JUAN CARLOS RINCON", total: 0 }
];

module.exports = (req, res) => {
    // 1. OBTENER MAESTROS (GET)
    if (req.method === 'GET') {
        return res.status(200).json(memoriaMaestros);
    }

    // 2. PROCESAR ACCIONES (POST)
    if (req.method === 'POST') {
        
        // ACCIÓN ESPECIAL: Restaurar desde el respaldo del TV si se reinicia
        if (req.body.restaurarTodo) {
            memoriaMaestros = req.body.restaurarTodo;
            return res.status(200).json({ success: true, mensaje: "Base restaurada" });
        }

        // CASO A: Es un registro de un NUEVO JUGADOR desde /registro
        if (req.body.nuevoMaestro) {
            const nombreNuevo = req.body.nuevoMaestro.trim().toUpperCase();
            
            const existe = memoriaMaestros.some(m => m.nombre === nombreNuevo);
            if (existe) {
                return res.status(200).json({ success: true });
            }

            const nuevoId = (memoriaMaestros.length > 0) ? (Math.max(...memoriaMaestros.map(m => parseInt(m.id))) + 1).toString() : "1";
            const nuevoObjeto = { id: nuevoId, nombre: nombreNuevo, total: 0 };

            memoriaMaestros.push(nuevoObjeto);
            return res.status(200).json({ success: true, maestro: nuevoObjeto });
        }

        // CASO B: Es una carga normal de PUNTOS
        const { id, puntos } = req.body;
        const maestro = memoriaMaestros.find(m => m.id === id);
        
        if (maestro) {
            maestro.total += parseInt(puntos);
            return res.status(200).json({ success: true, maestro });
        } else {
            return res.status(404).json({ success: false });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
};
