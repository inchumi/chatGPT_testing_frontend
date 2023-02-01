<template>
    <div v-show="show" :class="['modal', show ? 'modal-show' : 'modal-hide']">
        <div :style="modalStyle" :class="['modal-content', show ? 'show' : 'hide']">
            <div class="modal-header">
                <h3>{{ title }}</h3><span @click="close" class="close">&times;</span>
            </div>
            <div class="modal-body" v-html="message"></div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close'])
const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: "..."
    },
    show: {
        type: Boolean,
    },
    modal_bg_color: {
        type: String,
        default: '#40414f'
    },
    modal_msg_color: {
        type: String,
        default: 'white'
    }
})

const modalStyle = {
    color: `${props.modal_msg_color}`,
    'background-color': `${props.modal_bg_color}`
}

const close = () => {
    emit('close', '')
}
</script>

<style lang="css" scoped>
.modal-hide {
    display: none;
    transition: all 1s;
    -webkit-transition: all 1s;
}

.modal-show {
    display: block;
    transition: all 1s;
    -webkit-transition: all 1s;
}

.modal-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    color: darkgray;
}

.modal-body {
    font-size: small;
    overflow-y: auto;
    max-height: 400px;
}

.modal {
    /* Hidden by default */
    position: absolute;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    left: 0;
    bottom: 0;
    width: 100vw;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: hidden;
    background: rgba(32, 33, 35, 0.38);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transition: all 1s;
    -webkit-transition: all 1s;
}

.modal-content {
    margin: 10em auto;
    padding: 25px;
    border: 0;
    border-radius: 10px;
    width: 70vw;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.hide {
    transition: all 1s;
    -webkit-transition: all 1s;
    opacity: 0;
    -webkit-animation: slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.show {
    transition: all 2s;
    -webkit-transition: all 1s;
    opacity: 1;
    -webkit-animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes slide-top {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
    }

    100% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
    }
}

@keyframes slide-top {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
    }

    100% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
    }
}

@-webkit-keyframes slide-bottom {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
    }

    100% {
        -webkit-transform: translateY(100px);
        transform: translateY(100px);
    }
}

@keyframes slide-bottom {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
    }

    100% {
        -webkit-transform: translateY(100px);
        transform: translateY(100px);
    }
}
</style>