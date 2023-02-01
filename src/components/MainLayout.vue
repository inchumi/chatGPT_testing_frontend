<template>
    <div class="app">
        <Navbar @showSidebar="setShowSidebar" />
        <div class="container">
            <Sidebar @disableInput="toggleDisabled" :show-sidebar="showSidebar" @showModal="toggleModal" />
            <section>
                <ChatList />
                <div class="prompt">
                    <UserInput :is-disabled="isInputDisabled" />
                </div>
            </section>
        </div>
        <Modal @close="toggleModal" :show="showModal" :title="setModalTitle" :message="setModalMessage" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
import Modal from './Modal.vue';
import ChatList from './ChatList.vue';
import UserInput from './UserInput.vue';

const showSidebar = ref(true)
const showModal = ref(false)
const setModalTitle = ref('')
const setModalMessage = ref('')
const isInputDisabled = ref(false)

const toggleDisabled = () => {
    isInputDisabled.value = newVal
}

const toggleModal = (params) => {
    showModal.value = !showModal.value
    setModalTitle.value = params.title
    setModalMessage.value = params.message
}
const setShowSidebar = (evt) => {
    showSidebar.value = !evt
}
</script>

<style lang="css" scoped>
.app {
    height: 100vh;
}

.container {
    background-color: #343541;
    display: flex;
    height: calc(100% - 50px);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 100%;
    padding: 1em;
}

section {
    background-color: #343541;
    flex: 80%;
    position: relative;
}

.chats {
    display: flex;
    flex-flow: column nowrap;
    background-color: #343541;
    overflow-y: auto;
    width: 100%;
    height: 85%;
    bottom: 15%;
    position: absolute;
    transition: all .5s ease .5s;
}

.prompt {
    background: #40414fb8;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    padding: 2em 0;
    bottom: 0;
    width: 100%;
    position: absolute;
    height: 15%;
    transition: height .5s ease .5s;
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


section ul {
    padding: 0;
}

.logo {
    padding-top: 1em;
    min-width: 30px;
}

@media (max-width: 765px) {
    aside {
        padding: 5px;
        width: 100%;
    }

    section {
        width: 100%;
    }

    .prompt {
        height: auto;
    }

    .prompt textarea {
        height: auto;
    }

    .chats {
        height: 90%;
        bottom: 10%;
        transition: all .5s ease;
    }

}
</style>