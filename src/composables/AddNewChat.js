import store from '../store'

export default function addNewChat() {
    if (!store.state.apiKey) return
    const uniqID = store.state.apiKey

    
    store.actions.setChatLogs([])
    store.actions.setCurrentChat(`Chat #${Date.now().toString().slice(5)}`)
    store.actions.setChatIDs([...store.state.chatIDs, store.state.currentChat])
    //emit('disableInput', false)

    const findConvsByUniqID = store.state.conversations.find(conversation => conversation.uniqID == store.state.apiKey)
    if (!findConvsByUniqID) {
        store.actions.setConversations([
            ...store.state.conversations,
            {
                uniqID: uniqID,
                chats: []
            }
        ])
        return (console.log("No conversations, adding new one"))
    }

    const findConvByChatID = findConvsByUniqID?.chats.find(conversation => conversation.chatID == store.state.currentChat)
    if (!findConvByChatID) return (console.log("Cant find chat Id"))
    const filteredChatLogs = findConvsByUniqID.chats.filter(conversation => conversation.chatID == store.state.currentChat)
    const [logs] = filteredChatLogs
    store.actions.setChatLogs(logs.chatLogs)
    //emit('focusOnInput', true)
}