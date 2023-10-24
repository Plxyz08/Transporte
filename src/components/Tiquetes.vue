<template>
    <div class="q-gutter-md">
        <div class="bus-layout">
            <div class="asientos" v-if="mostrarContenido">
                <div class="fila" v-for="(fila, filaIndex) in filas" :key="filaIndex">
                    <div class="asiento" v-for="(asiento, asientoIndex) in fila" :key="asiento.numero">
                        <button @click="seleccionarAsiento(asiento)"
                            :class="{ 'asiento-button': true, 'selected': asientoSeleccionado === asiento, 'reserved': asiento.reservado }">
                            <q-icon :name="asiento.reservado ? 'check' : 'event_seat'" class="asiento-icon"></q-icon>
                            {{ asiento.numero }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-else>
                <q-btn @click="iniciarVenta" icon="add" color="primary">
                    Agregar venta
                </q-btn>
            </div>
            <div v-if="asientoSeleccionado" class="formulario">
                <h4>Asiento #{{ asientoSeleccionado.numero }}</h4>
                <form @submit.prevent="comprarBoleto">
                    <label for="cedula">Cédula:</label>
                    <q-input type="text" id="cedula" v-model="cedula" outlined label="Cédula" required></q-input>
                    <label for="telefono">Teléfono:</label>
                    <q-input type="tel" id="telefono" v-model="telefono" outlined label="Teléfono" required></q-input>
                    <label for="nombre">Nombre:</label>
                    <q-input type="text" id="nombre" v-model="nombre" outlined label="Nombre" required></q-input>
                    <q-btn type="submit" color="primary" label="Comprar"></q-btn>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filas: generateBusLayout(10, 4),
            mostrarContenido: false,
            asientoSeleccionado: null,
            cedula: "",
            telefono: "",
            nombre: "",
        };
    },
    methods: {
        reservarAsiento(asiento) {
            if (!asiento.reservado) {
                asiento.reservado = true;
            }
        },
        seleccionarAsiento(asiento) {
            if (!asiento.reservado) {
                this.asientoSeleccionado = asiento;
            }
        },
        comprarBoleto() {
            // Lógica de compra del boleto
            // Puedes agregar tu lógica aquí
            // Después de la compra, puedes restablecer el asiento seleccionado si es necesario.
            this.asientoSeleccionado = null;
        },
        iniciarVenta() {
            this.mostrarContenido = true;
        },
    },
};

function generateBusLayout(filas, asientosPorFila) {
    const layout = [];
    let numeroSilla = 1;
    for (let fila = 1; fila <= filas; fila++) {
        const filaAsientos = [];
        for (let asiento = 1; asiento <= asientosPorFila; asiento++) {
            filaAsientos.push({ numero: numeroSilla, reservado: false });
            numeroSilla++;
        }
        layout.push(filaAsientos);
    }
    return layout;
}
</script>

<style scoped>
.bus-layout {
    display: flex;
    flex-direction: row;
}

.asientos {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 2rem 6rem 1rem 1rem;
}

.fila {
    display: flex;
    margin: 5px;
}

.asiento {
    margin: 5px;
}

/* Personaliza el estilo de las filas y asientos para darle forma de bus */
.fila {
    justify-content: center;
    align-items: center;
}

.asiento-button {
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 50%;
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.selected {
    background-color: #00b0ff;
}

.reserved {
    background-color: #ff0000;
}

.asiento-icon {
    font-size: 20px;
}
</style>
