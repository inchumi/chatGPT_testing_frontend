<template>
    <div class="chats">
        <TransitionGroup name="chatlist" tag="ul2">
            <div :class="[chat.author !== 'me' ? 'chatline__grey-backgorund' : '']"
                v-for="chat, idx of store.state.chatLogs" :key="idx">
                <div class="chats__log_lines chats__log_lines_container">
                    <div class="logo"><img :src="chat.author !== 'me' ? gptAvatar : userAvatar" alt=""></div>
                    <div :class="['chatline', chat.author !== 'me' ? 'chatline__gpt_text' : 'chatline__user_text']">
                        <pre>
                            {{ chat.txt }}
                        </pre>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import gptAvatar from '../assets/react100xengineer.png'
import userAvatar from '../assets/user_image.jpg'
import store from "../store"

</script>

<style lang="css" scoped>
pre {
    font-family: inherit !important;
    font-size: inherit !important;
    white-space: pre-line;
    white-space: -pre-line;
    white-space: -o-pre-line;
    word-wrap: break-word;
    text-align: left;
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
    gap: 1em;
    padding: 1em;
}

.chatline {
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


.chatlist-enter-active,
.chatlist-leave-active {
    transition: all 0.5s ease;
}

.chatlist-enter-from,
.chatlist-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.chats_list {
    height: 290px;
    overflow: auto;
}

.chats_list ul li {
    margin: 0;

}

.chats {
    scroll-behavior: smooth;
    overflow-y: auto;
    width: 100%;
    height: auto;
}

@media (max-width: 765px) {
    .chats__log_lines_container {
        margin: 0;
    }
}
</style>