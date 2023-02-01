<template>
    <div class="prompt_line">
        <textarea :disabled="isInputDisabled" ref="txtarea" name="" id="" cols="30" :rows="txtrows"
            v-model.trim="inputTxt" @keydown.enter="onSubmit">
        </textarea>
        <div class="loading">
            <button @click="onSubmit">
                <img src="/react.svg" alt="react logo" :class="[isLoading ? 'rotate' : 'stop_rotate']">
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '../store';
import addNewChat from '../composables/AddNewChat';

const props = defineProps({
    isDisabled: {
        type: Boolean,
        default: true
    }
})
const txtarea = ref()
const inputTxt = ref('')
const isLoading = ref(false)
const txtrows = computed(() => inputTxt.value.length > 350 ? 10 : 1)
const isInputDisabled = ref(props.isDisabled)

const onSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.value) return
    if (!store.state.currentChat) addNewChat()

    const uniqID = store.state.apiKey
    const chatID = store.state.currentChat

    if (!uniqID || !store.state.allModels || !inputTxt.value) return false
    isInputDisabled.value = true
    isLoading.value = true

    const UniqIdFound = store.state.conversations.find(conversation => conversation.uniqID == uniqID)

    if (!UniqIdFound) {
        store.state.conversations = [
            ...store.state.conversations,
            {
                uniqID: uniqID,
                chats: []
            }
        ]
    } else {
        // Uniq ID exists
        const chatIDIsFound = UniqIdFound.chats.find(chat => chat.chatID == chatID)

        if (!chatIDIsFound) {
            console.log('No se encontró el chatID');

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

            store.state.conversations.forEach((conversation, ix) => {
                if (conversation.uniqID == store.state.apiKey) {
                    conversation.chats.forEach(async (chat, idx) => {
                        if (chat.chatID === chatID) {

                            const gptResponse = await store.actions.getCompletions(store.state.apiKey)

                            if (gptResponse) {
                                const removeEmisor = gptResponse.replace(/Senior Dev:\s?/, '')
                                const cleanResponse = removeEmisor.replace('\n', '\r')
                                store.state.conversations[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: cleanResponse })
                                isLoading.value = false
                                isInputDisabled.value = false
                                txtarea.value.focus()
                            }

                            // setTimeout(() => {
                            //     store.state.conversations[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: 'Lorem itsumkjhask hjksdhjdhfkjshd hjshkjhksjdfhkjh skjdhksjdhf ksjdhkjsdhkfj ksjdhfk sdjfhkjksjdfh ksjhdf ksjdhksjdh fksjdhkfsjdhf ksjdfh ksdjfhskdjfhsk djfhksjdf h' })
                            //     isLoading.value = false
                            //     isInputDisabled.value = false
                            //     txtarea.value.focus()
                            // }, 1000);

                        }
                    })
                }
            })
            const findConvsByUniqID = store.state.conversations.find(conversation => conversation.uniqID == store.state.apiKey)
            console.log(findConvsByUniqID);
            const chatsLog = findConvsByUniqID.chats.filter(conversation => conversation.chatID == store.state.currentChat)
            const [logs] = chatsLog
            const chatLogs = logs.chatLogs ?? []
            store.actions.setChatLogs(chatLogs)

        } else {
            console.log('SI se encontró el chatID');

            store.state.conversations.forEach((conversation, ix) => {
                if (conversation.uniqID == store.state.apiKey) {
                    conversation.chats.forEach(async (chat, idx) => {
                        if (chat.chatID === chatID) {
                            store.actions.setPrompt(e.target.value)
                            store.state.conversations[ix].chats[idx].chatLogs.push({ author: 'me', txt: e.target.value })

                            const gptResponse = await store.actions.getCompletions(store.state.apiKey)

                            if (gptResponse) {
                                const removeEmisor = gptResponse.replace(/Senior Dev:\s?/, '')
                                const cleanResponse = removeEmisor.replace('\n', '\r')
                                store.state.conversations[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: cleanResponse })
                                isLoading.value = false
                                isInputDisabled.value = false
                            }

                            // setTimeout(() => {
                            //     store.state.conversations[ix].chats[idx].chatLogs.push({ author: 'chatgpt', txt: '?\nClaro, aquí tienes el código:\n\n// usando setInterval\nuseEffect(() => {\n  const interval = setInterval(() => {\n    //Haz algo aquí\n  }, 1000);\n  return () => clearInterval(interval);\n}, []);\n\n// usando setTimeout\nuseEffect(() => {\n  const timeout = setTimeout(() => {\n    //Haz algo aquí\n  }, 1000);\n  return () => clearTimeout(timeout);\n}, []);' })
                            //     isLoading.value = false
                            //     isInputDisabled.value = false
                            //     txtarea.value.focus()
                            // }, 1000);

                        }
                    })
                }
            })

        }
    }

    inputTxt.value = ' '
}

</script>

<style lang="css" scoped>
.prompt_line {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    width: 80%;
}

.prompt_line textarea {
    width: 100%;
    height: fit-content;
}

textarea {
    resize: none;
}

textarea {
    height: auto;
    background-color: #84839345;
    border-radius: 5px;
    border: 0;
    padding: 1em;
    color: rgb(215, 215, 215);
    word-wrap: break-word;
}

.loading {
    right: 0;
    top: 0;
    position: relative;
    cursor: pointer;
}

.rotate {
    animation: girar 1s infinite linear;
}

.stop_rotate {
    transform: rotate(0deg);
}

textarea,
input:focus-visible {
    outline: 0;
    color: white;
}

button {
    background-color: rgba(128, 128, 128, 0.296);
    border: 0;
    border-radius: 5px;
    padding: .3em;
}

button:hover {
    background-color: rgba(100, 148, 237, 0.308);
    cursor: pointer;
}

@keyframes girar {
    0% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>