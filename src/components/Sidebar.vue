<template>
    <Transition name="list">
        <aside v-show="store.state.showSidebar">
            <div class="menu">
                <div class="cta" @click="addNewChat"><font-awesome-icon icon="fa-solid fa-plus" />&nbsp; Nueva
                    conversación</div>
                <div class="cta__chats">
                    <ul>
                        <li>
                            <label for="models"><small>MODELOS DISPONIBLES</small></label>
                            &nbsp;<font-awesome-icon v-show="isLoadingModels" icon="fa-solid fa-spinner" spin />
                            <select :disabled="!modelOptions" name="models" id="models" @change="setSelectedModel">
                                <option v-if="!modelOptions" value="none" selected disabled hidden>-- APIKEY no válido
                                    --</option>
                                <option v-for="option in modelOptions" :key="option" :value="option"
                                    :selected="option === 'text-davinci-003'">{{ option }}</option>
                            </select>
                        </li>
                    </ul>
                </div>
                <label v-show="store.state.chatIDs.length > 0"
                    for="chat_IDs_List"><small>&nbsp;&nbsp;CHATS</small>&nbsp;&nbsp;</label>
                <font-awesome-icon v-show="isLoadingChats" icon="fa-solid fa-spinner" spin />
                <div class="cta_chats chats_list">
                    <ul id="chat_IDs_List">
                        <TransitionGroup name="list" tag="ul2">
                            <li v-for="chatID, idx of store.state.chatIDs" :key="chatID">
                                <div class="cta" :id="idx" :data-chatid="chatID"
                                    :class="[(itemA == idx) ? 'li__active' : '']" @click="getChatLogByChatID">
                                    <font-awesome-icon icon="fa-regular fa-message" />&nbsp; {{
                                        chatID
                                    }}
                                </div>
                            </li>
                        </TransitionGroup>
                    </ul>
                </div>
            </div>
            <div class="settings">
                <ul>
                    <li>
                        <label for="apikey_input"><small>TU API KEY:</small></label>
                        <input ref="apikeyinput" id="apikey_input" class="apikey_input" placeholder="API Key..."
                            :onchange="getModels" v-model="apiKey" type="search">
                    </li>
                    <li @click="clearConversations"><font-awesome-icon icon="fa-solid fa-trash-can" />
                        &nbsp;Borrar
                        conversaciones
                    </li>
                    <li @click="showModal">
                        <font-awesome-icon icon="fa-regular fa-circle-question" />&nbsp;
                        Ayuda
                    </li>
                    <li>
                        <font-awesome-icon icon="fa-solid fa-at" /><a href="mailto:davidalejandrocano@gmail.com">&nbsp;
                            Contactame</a>
                    </li>
                    <li>
                        <font-awesome-icon icon="fa-brands fa-github" />
                        <a href="https://github.com/inchumi/chatGPT_testing_frontend" target="_blank"
                            rel="noopener noreferrer">&nbsp; El Repo</a>
                    </li>
                </ul>
            </div>
        </aside>
    </Transition>

</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import store from "../store";
import addNewChat from "../composables/AddNewChat"

const apiKey = ref('')
const itemA = ref(-1)
const apikeyinput = ref()
const isLoadingChats = ref(false)
const isLoadingModels = ref(false)
const modelOptions = ref(store.state.allModels)

const emit = defineEmits(['disableInput', 'focusOnInput', 'showModal'])

watch(apiKey, (newVal, _) => {
    if (!newVal) modelOptions.value = newVal
    store.actions.setApiKey(newVal)
    isLoadingChats.value = true
    getAllChatIDs()
})

onMounted(async () => {
    await getModels()
})

const showModal = () => {
    emit('showModal', { showModal: true, title: messageForModal.title, message: messageForModal.message })
}

itemA.value = store.state.chatIDs?.length

const getModels = async () => {
    store.actions.setApiKey(apiKey.value)
    if (!store.state.apiKey) return
    isLoadingModels.value = true
    modelOptions.value = await store.actions.getModels();
    if (modelOptions.value === false) {
        apikeyinput.value.focus()
    }
    isLoadingModels.value = false
}

function getChatLogByChatID(e) {
    console.log(e.target.getAttribute('data-chatid'))
    itemA.value = e.target.closest('div').getAttribute('id')
    const chatID = e.target.getAttribute('data-chatid')
    const uniqID = store.state.apiKey
    console.log('Setted apiKey: ', uniqID)

    store.actions.setChatLogs([])
    store.actions.setCurrentChat(chatID)
    if (!apiKey.value) return
    const findConvsByUniqID = store.state.conversations.find(conversation => conversation.uniqID == uniqID)
    const findConvByChatID = findConvsByUniqID.chats.find(conversation => conversation.chatID == chatID)

    if (!findConvByChatID) return
    const filteredChatsLog = findConvsByUniqID.chats.filter(conversation => conversation.chatID == chatID)
    const [logs] = filteredChatsLog
    store.actions.setChatLogs(logs.chatLogs)
    emit('disableInput', false)
    emit('focusOnInput', true)
}

const clearConversations = () => {
    store.actions.setChatLogs([])
    store.actions.setChatIDs([])
    store.actions.setConversations([])
    emit('disableInput', true)
}

const setSelectedModel = (evt) => {
    store.actions.setSelectedModel(evt.target.value)
}

function getAllChatIDs() {
    isLoadingChats.value = true
    const getAllChatsIDs = store.state.conversations
    console.log('conversations: ', store.state.conversations);
    getAllChatsIDs.forEach(chat => {
        if (chat.uniqID === store.state.apiKey) {
            store.actions.setChatIDs(chat.chats.map(chat => chat.chatID))
        } else {
            store.actions.setChatIDs([])
        }
    })
    isLoadingChats.value = false
}

const messageForModal = {
    title: '¿Cómo uso esto, para qué sirve?',
    message: `
    <p>Este es un proyecto demo que intenta, por un lado probar uno de los modelos conversacionales pre entrenados ofrecidos por la empresa OPENAI de forma gratuita con el objetivo de complementar la asistencia que debe recibir un desarrollador React despejando todas sus dudas sin recurrir a buscadores y foros u gastar horas viendo videos en Youtube!</p>
    <br/>
    <br/>
<h3>Paso 1</h3>
<ul>
    <li>
        <h3>- Dar de alta tu cuenta en OPENAI: </h3>
        <p>Tenés que dirigirte a este <a href="https://beta.openai.com/signup" target="_blank"><strong>link</strong></a> (OPENAI.com) y crearte una cuenta.</p>
        <br/>
        <img src="/paso1.jpg" alt="paso 1" />
    </li> 
    <br/>
    <li>
        <h3>- Generar tu APIKEY: </h3>
        <br/>
        <img src="/paso2.jpg" alt="paso 2" />
        <br/>
        <img src="/paso3.jpg" alt="paso 3" />
    </li>
    <br/>
<h3>Paso 2</h3>
    <li>
        <h3>- Colocá tu APIKEY e ingresá la pregunta que quieras que te conteste la IA: </h3>
        <br/>
        <img src="/paso4.jpg" alt="paso 4" />
        <br/>
        <img src="/paso5.jpg" alt="paso 5" />
    </li>
    <li>
        <p>Disclaimer: La prueba gratuita tiene límite en uso por token.</p>
    </li>
</ul>
    <br/>
    <br/>
    <br/>
    <br/>
<h3>Además de los modelos GPT y los motores, OpenAI también ofrece varios otros modelos que están optimizados para tareas específicas o industrias.</h3>
<ul>
  <li>
    <h3>Curie:</h3>
    <p>Este es un modelo de IA de conversación que está optimizado para tareas de servicio al cliente y soporte. Puede entender y responder a las consultas del cliente y puede manejar una amplia gama de temas.</p>
  </li>
  <li>
    <h3>Davinci:</h3>
    <p>Este es un modelo de IA de conversación que está optimizado para tareas más complejas y creativas como escribir, contar historias y crear contenido. Puede generar texto similar al humano y se puede utilizar para tareas como escribir ficción, guiones y artículos.</p>
  </li>
  <li>
    <h3>Ada:</h3>
    <p>Este es un modelo para moderación de contenido automatizada. Está diseñado para detectar y marcar contenido potencialmente dañino o ofensivo. Se puede utilizar para moderar comentarios, mensajes y otros contenidos generados por el usuario.</p>
  </li>
  <li>
    <h3>Babbage:</h3>
    <p>Este es un modelo para extracción y resumen de contenido automatizado. Puede extraer información clave de documentos grandes como artículos de noticias, informes y trabajos científicos y puede resumirlos en una forma más corta.</p>
  </li>
  <li>
    <h3>Jukebox:</h3>
    <p>Este es un modelo para generación de música. Puede generar pistas de música en diferentes estilos y géneros basadas en la entrada proporcionada por el usuario.</p>
  </li>
</ul>
<br/>
<br/>
<p>Para más información click <a href="https://beta.openai.com/docs/models/overview" target="_blank"><strong>aquí</strong></a>. &nbsp; (Texto generado por chatGPT). </p>`}
</script>

<style lang="css" scoped>
aside {
    display: block;
    background-color: #202123;
    color: white;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    gap: 1em;
    width: 264px;
    padding: 1em;
}

aside ul li {
    border-radius: 5px;
    cursor: pointer;
}

.settings ul li:hover {
    background-color: rgba(255, 255, 255, 0.132);
}

.menu {
    flex: 2;
    overflow-y: auto;
    overflow-x: hidden;

}

.links {
    flex: 1;
    overflow-y: auto;
}

select {
    text-align: left;
    height: 2em;
    background-color: #a0a0a0;
    color: rgb(0, 0, 0);
    cursor: pointer;
    width: 100%;
}

#chat_IDs_List li {
    padding: .2em;
}

.cta {
    padding: .5em .5em .5em 1.5em;
    border: 1px solid rgb(80, 80, 80);
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.cta:hover {
    background-color: rgba(255, 255, 255, 0.132);
}



.li__active {
    background-color: rgba(255, 255, 255, 0.132);
}

[type="search"]::-webkit-search-cancel-button {
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
    width: 10px;
    background-image: url('../assets/svg-EQUIS.svg');
    background-size: 10px 10px;
}

/*------------------Transitions--------------------*/

.list-enter-active,
.list-leave-active {
    transition: all .2s ease-out;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>