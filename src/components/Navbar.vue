<template>
    <nav class="navbar">
        <div>
            <h3>React tutor</h3>
        </div>
        <div>
            <a @click="showSidebar"><font-awesome-icon icon="fa-2xl fa-bars" /></a>
        </div>
    </nav>
</template>

<script setup>
import store from '../store';

const showSidebar = () => { store.actions.setShowSidebar(!store.state.showSidebar) }
</script>

<style lang="css" scoped>
.navbar {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    background-color: #34313a;
    color: white;
}
button:hover {
    background-color: #34313a;
    cursor: pointer;
    color: white;
}
</style>