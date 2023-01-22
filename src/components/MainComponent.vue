<template>
  <Modal :title="messageForModal.title" :message="messageForModal.message" :show="showModal" />
  <div>
    <aside>
      <nav>
        <div class="cta-buttons">
          <div class="cta" @click="addNewConversation"><font-awesome-icon icon="fa-solid fa-plus" />&nbsp; Nueva
            conversación</div>
          <div class="cta__chats">
            <ul>
              <li>
                <label for="models"><small>MODELOS DISPONIBLES</small></label>
                &nbsp;<font-awesome-icon v-show="isLoadingModels" icon="fa-solid fa-spinner" spin />
                <select :disabled="!modelOptions" name="models" id="models" @change="setSelectedModel">
                  <option v-if="!modelOptions" value="none" selected disabled hidden>-- APIKEY no válido --</option>
                  <option v-for="option in modelOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </li>
            </ul>
          </div>
          <label for="chatlist"><small>&nbsp;&nbsp;CHATS</small> </label>
          <font-awesome-icon v-show="isLoadingChats" icon="fa-solid fa-spinner" spin />
          <div class="cta_chats chats_list">
            <ul id="chatlist">
              <TransitionGroup name="list" tag="ul2">
                <li v-for="chatID, idx of chatIDs" :key="chatID">
                  <div class="cta" :id="idx" :data-chatid="chatID" :class="[(itemA == idx) ? 'li__active' : '']"
                    @click="getChatLogByChatID"><font-awesome-icon icon="fa-regular fa-message" />&nbsp; {{
                      chatID
                    }}</div>
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
            <li @click="clearConversations"><font-awesome-icon icon="fa-solid fa-trash-can" />&nbsp; Borrar
              conversaciones</li>
            <li @click="showModal = !showModal"><font-awesome-icon icon="fa-regular fa-circle-question" />&nbsp; Ayuda
            </li>
            <li><font-awesome-icon icon="fa-solid fa-at" /><a href="mailto:davidalejandrocano@gmail.com">&nbsp;
                Contactame</a></li>
            <li><font-awesome-icon icon="fa-brands fa-github" />&nbsp; El Repo</li>
          </ul>

        </div>
      </nav>
    </aside>
  </div>
  <section>
    <div class="chats">
      <TransitionGroup name="chatlist" tag="ul2">

        <div :class="[chat.author !== 'me' ? 'chatline__grey-backgorund' : '']" v-for="chat, idx of chatLogs"
          :key="idx">
          <div class="chats__log_lines chats__log_lines_container">
            <div class="logo"><img :src="chat.author !== 'me' ? gptAvatar : userAvatar" alt=""></div>
            <div :class="['chatline', chat.author !== 'me' ? 'chatline__gpt_text' : 'chatline__user_text']">{{
              chat.txt
            }}</div>
          </div>
        </div>
      </TransitionGroup>

    </div>
    <div class="usrquestions chatline">
      <textarea :disabled="isInputTxtDisabled" ref="txtarea" name="" id="" cols="30" :rows="txtrows"
        v-model.trim="inputTxt" @keydown.enter="onSubmit"></textarea>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import gptAvatar from '../assets/chatgpt-logo.jpeg'
import userAvatar from '../assets/user_image.jpg'
import store from '../store'
import Modal from './Modal.vue'

const conversations = ref([])


const chatLogs = ref([])
const chatIDs = ref([])
const modelOptions = ref(store.state.allModels)
const apiKey = ref('')
const apikeyinput = ref()
const inputTxt = ref('')
const txtarea = ref()
const currentConversation = ref('')
const isInputTxtDisabled = ref(true)
const itemA = ref(-1)
const showModal = ref(false)
const isLoadingChats = ref(false)
const isLoadingModels = ref(false)

onMounted(async () => {
  apiKey.value = store.state.apiKey
  await getModels()
  getAllChatLogs()
})

function getAllChatLogs() {
  isLoadingChats.value = true
  const getAllChatsIDs = conversations.value
  getAllChatsIDs.forEach(chat => {
    if (chat.uniqID === apiKey.value) {
      chatIDs.value = chat.chats.map(chat => chat.chatID)
    }
  })
  isLoadingChats.value = false
}

const messageForModal = {
  title: 'Sabías que...',
  message: `
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
<p>Para más información click <a href="https://beta.openai.com/docs/models/overview" target="_blank"><strong>aquí</strong></a>. Texto generado por chatGPT. </p>`}

const txtrows = computed(() => inputTxt.value.length > 350 ? 10 : 1)

watch(apiKey, (newVal, _) => {
  if (!newVal) modelOptions.value = newVal
  store.actions.setApiKey(newVal)
  getAllChatLogs()
})

function getChatLogByChatID(e) {
  console.log(e.target.getAttribute('data-chatid'))
  itemA.value = e.target.closest('div').getAttribute('id')
  const chatID = e.target.getAttribute('data-chatid')
  const uniqID = apiKey.value
  console.log(uniqID)

  chatLogs.value = []
  currentConversation.value = chatID
  if (!apiKey.value) return
  const findConvsByUniqID = conversations.value.find(conversation => conversation.uniqID == uniqID)
  const findConvByChatID = findConvsByUniqID.chats.find(conversation => conversation.chatID == chatID)

  if (!findConvByChatID) return
  const chatsLog = findConvsByUniqID.chats.filter(conversation => conversation.chatID == chatID)
  const [logs] = chatsLog
  chatLogs.value = logs.chatLogs
  isInputTxtDisabled.value = false
  txtarea.value.focus()
}

const getModels = async () => {
  if (!store.state.apiKey) return
  isLoadingModels.value = true
  modelOptions.value = await store.actions.getModels();
  if (modelOptions.value === false) {
    apikeyinput.value.focus()
  }
  isLoadingModels.value = false
}

const clearConversations = () => { conversations.value = []; chatIDs.value = []; isInputTxtDisabled.value = true }
const setSelectedModel = (evt) => {
  store.actions.setSelectedModel(evt.target.value)
}

const addNewConversation = () => {
  if (!apiKey.value) return
  const uniqID = apiKey.value

  itemA.value = chatIDs.value?.length
  chatLogs.value = []
  currentConversation.value = `Chat #${Date.now().toString().slice(5)}`
  chatIDs.value = [...chatIDs.value, currentConversation.value]
  isInputTxtDisabled.value = false

  const findConvsByUniqID = conversations.value.find(conversation => conversation.uniqID == apiKey.value)
  if (!findConvsByUniqID) {
    conversations.value = [
      ...conversations.value,
      {
        uniqID: uniqID,
        chats: []
      }
    ]
    return (console.log("No conversations, adding new one"))
  }

  const findConvByChatID = findConvsByUniqID?.chats.find(conversation => conversation.chatID == currentConversation.value)
  if (!findConvByChatID) return (console.log("Cant find chat Id"))
  const chatsLog = findConvsByUniqID.chats.filter(conversation => conversation.chatID == currentConversation.value)
  const [logs] = chatsLog
  chatLogs.value = logs.chatLogs
  txtarea.value.focus()
}

const onSubmit = async (e) => {
  e.preventDefault();
  if (!e.target.value) return
  if (!currentConversation.value) return
  const uniqID = apiKey.value
  const chatID = currentConversation.value

  if (!store.state.apiKey || !store.state.allModels || !inputTxt.value) return false

  const UniqIdFound = conversations.value.find(conversation => conversation.uniqID == uniqID)

  if (!UniqIdFound) {
    conversations.value = [
      ...conversations.value,
      {
        uniqID: uniqID,
        chats: []
      }
    ]
  } else {
    // Uniq ID exists
    const chatIDIsFound = UniqIdFound.chats.find(chat => chat.chatID == chatID)

    if (!chatIDIsFound) {
      console.log('No se econtró el chatID');

      store.actions.setPrompt(e.target.value)
      UniqIdFound.chats.push({
        chatID: chatID,
        chatLogs: [
          {
            author: 'me',
            txt: e.target.value
          }
        ]
      })

      conversations.value.forEach((conversation, ix) => {
        if (conversation.uniqID == apiKey.value) {
          conversation.chats.forEach(async (chat, idx) => {
            if (chat.chatID === chatID) {
              const gptResponse = await store.actions.getCompletions(apiKey.value)
              conversations.value[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: gptResponse })
            }
          })
        }
      })
      const findConvsByUniqID = conversations.value.find(conversation => conversation.uniqID == apiKey.value)
      console.log(findConvsByUniqID);
      const chatsLog = findConvsByUniqID.chats.filter(conversation => conversation.chatID == currentConversation.value)
      const [logs] = chatsLog
      chatLogs.value = logs.chatLogs

    } else {
      console.log('SI se econtró el chatID');

      conversations.value.forEach((conversation, ix) => {
        if (conversation.uniqID == apiKey.value) {
          conversation.chats.forEach(async (chat, idx) => {
            if (chat.chatID === chatID) {
              store.actions.setPrompt(e.target.value)
              conversations.value[ix].chats[idx].chatLogs.push({ author: 'me', txt: e.target.value })
              const gptResponse = await store.actions.getCompletions(apiKey.value)
              conversations.value[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: gptResponse })
            }
          })
        }
      })

    }

  }

  inputTxt.value = ' '
}

</script>

<style scoped lang="css">
.cta__chats ul {
  overflow: none;
}

aside {
  visibility: 1;
  opacity: 1;
  font-size: .9em;
  width: 260px;
  height: 100vh;
  background-color: #202123;
  padding: .5rem;
  color: white;
  overflow: auto;
}

nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

aside ul {
  padding: 0;
  margin: .5em 0;
  overflow-x: hidden;
}

aside ul li {
  margin: .5em 0;
  list-style: none;
  padding: .5em;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}

.settings ul li:hover {
  background-color: rgba(255, 255, 255, 0.132);
  color: white;
}

.li__active {
  background-color: rgba(255, 255, 255, 0.132);
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

.cta-buttons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-bottom: .3px solid #ffffff33;

  height: 100%;
}

.chats_list {
  height: 290px;
  overflow: auto;
}

.chats_list ul li {
  margin: 0;

}

small {
  color: #615c5c;
}

.settings {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.apikey_input {
  height: 2em;
  background-color: #84839345;
  border-radius: 5px;
  border: 0;
  padding: 1.2em;
  color: rgb(215, 215, 215);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 5px;
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

select {
  text-align: left;
  font-size: large;
  height: 2em;
  background: red;
  background-color: #a0a0a0;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  width: 100%;
  padding-left: 1em;
}

select::selection {
  color: red;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  background-color: #343541;
  position: relative;
  padding-bottom: 5em;
  overflow-x: hidden;
}

section ul {
  padding: 0;
}

.logo {
  padding-top: 1em;
  min-width: 30px;
}

.logo img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.chats__log_lines_container {
  margin: 0em 5em;
}

.chats__log_lines {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1em;
}

.chatline {
  display: flex;
  justify-content: flex-start;
  text-align: center;
  align-items: center;
  text-align: left;
  padding: 1em;
}

.chatline__grey-backgorund {
  background-color: #444654;
}

.chatline__gpt_text {
  color: #d9d9e3;
}

.chatline__user_text {
  color: #fff;
}


.chats {
  scroll-behavior: smooth;
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.usrquestions {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #40414fb8;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  bottom: 0;
}

.usrquestions textarea {
  width: 80%;
  height: fit-content;
}

textarea {
  resize: none;
}

textarea {
  height: 3.5em;
  background-color: #84839345;
  border-radius: 5px;
  border: 0;
  padding: 1em;
  color: rgb(215, 215, 215);
  word-wrap: break-word;
}

textarea,
input:focus-visible {
  outline: 0;
  color: white;
  ;
}

@media (max-width: 760px) {
  aside {
    display: none;
    visibility: hidden;
    opacity: 0;
    transition: visibility 1s, opacity 1s;

  }

  .chats__log_lines_container {
    margin: 0;
  }

  .usrquestions input,
  textarea {
    width: 100%;
  }
}

/* ---------------- Transitions ---------------*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.chatlist-enter-active,
.chatlist-leave-active {
  transition: all 0.5s ease;
}

.chatlist-enter-from,
.chatlist-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
