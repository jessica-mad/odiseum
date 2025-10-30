// ============================================
// DATOS DE MENSAJES CUÁNTICOS - ODISEUM V2.0
// ============================================

/* === MENSAJES PROGRAMADOS === */
const QUANTUM_MESSAGES = [
    // TRAMO 3 (Año ~15)
    {
        tranche: 3,
        type: 'earth',
        recipient: 'Capitán Silva',
        text: `Papá, tengo 27 años ahora.

Mamá falleció hace 3 años del corazón. Los médicos dijeron que el estrés...

Pienso en ti cada noche mirando las estrellas. ¿Puedes verme desde allá?

Por favor, llega vivo. Te amo.

- Sofía`
    },
    {
        tranche: 3,
        type: 'new-earth',
        recipient: 'Tripulación de Odiseum',
        text: `Año 115 de la colonia.

Nuestra población envejece sin nuevas generaciones. La diversidad genética se agota.

Los embriones que traen son nuestra única esperanza de futuro.

Dense prisa. Los estamos esperando con ansias.

- Gobernadora Chen, Colonia Esperanza`
    },
    
    // TRAMO 5 (Año ~25)
    {
        tranche: 5,
        type: 'earth',
        recipient: 'Dra. Chen',
        text: `Dra. Chen,

Su madre falleció en paz hace 6 meses. En sus últimos días lúcidos, preguntaba por usted.

Le mostramos fotos de la Odiseum. Sonrió y dijo: "Mi hija salvará a muchos".

Su legado continúa en usted.

- Centro Médico Terra Nova`
    },
    {
        tranche: 5,
        type: 'new-earth',
        recipient: 'Ing. Rodriguez',
        text: `Ingeniero Rodriguez,

Los sistemas de la Primera Expedición están fallando. Necesitamos urgentemente los repuestos que traen.

Su experiencia será invaluable para reconstruir nuestra infraestructura.

La humanidad cuenta con usted.

- Jefe de Ingeniería, Colonia Esperanza`
    },
    
    // TRAMO 7 (Año ~35)
    {
        tranche: 7,
        type: 'earth',
        recipient: 'Lt. Johnson',
        text: `Hijo,

Tu padre falleció el año pasado. Hasta el final, habló de ti con orgullo.

Yo estoy bien, pero muy sola. Los hijos de tus primos preguntan por el tío astronauta.

Llega a salvo. Haz historia. Es lo que tu padre hubiera querido.

Te amo, mamá`
    },
    {
        tranche: 7,
        type: 'earth',
        recipient: 'Chef Patel',
        text: `Abuela,

Tengo 30 años. Mis hijos preguntan por ti.

Les muestro tu foto y les cuento que cultivas jardines entre las estrellas.

Te extrañamos mucho. Por favor cuídate.

- Tu nieto mayor, Arjun`
    },
    
    // TRAMO 9 (Año ~45)
    {
        tranche: 9,
        type: 'new-earth',
        recipient: 'Tripulación de Odiseum',
        text: `¡URGENTE!

Colonia Esperanza está en alerta. Una enfermedad desconocida afecta a nuestros ancianos.

Sin diversidad genética, no podemos desarrollar inmunidad.

Los embriones son más críticos que nunca. ¡APRESÚRENSE!

- Consejo de Emergencia, Colonia Esperanza`
    },
    {
        tranche: 9,
        type: 'earth',
        recipient: 'Capitán Silva',
        text: `Comandante Silva,

Soy Sofía, tu hija. Tengo 57 años ahora.

Tengo dos nietos. Les puse Andrés y Elena, como tú y mamá.

No sé si este mensaje te alcanzará. No sé si sigues vivo.

Pero quiero que sepas que tu sacrificio no fue en vano.

Siempre fuiste mi héroe.

- Sofía Silva`
    }
];

/* === FUNCIÓN HELPER PARA CARGAR MENSAJES === */
function loadQuantumMessages() {
    QUANTUM_MESSAGES.forEach(msg => {
        messageSystem.addMessage(msg.tranche, msg.type, msg.recipient, msg.text);
    });
}
