import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faTrashCan, faArrowRightFromBracket, faPlus, faSpinner, faAt, faBars } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCircleQuestion, faMessage } from '@fortawesome/free-regular-svg-icons'


/* add icons to the library */
library.add(faTrashCan, faArrowRightFromBracket, faPlus, faCircleQuestion, faMessage, faSpinner, faAt, faGithub, faBars)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
