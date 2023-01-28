import { reactive, readonly } from 'vue'

const state = reactive({
    allModels: undefined,
    chatHistory: undefined,
    selectedModel: 'text-davinci-003',
    prompt: `La siguiente conversación es con un Senior React Js developer:\n\nYo: Con qué manejo los estados en React?\nSenior Dev: Debes usar el hook useState\nYo: Qué es el useEffect?\nSenior Dev: El useEffect es un hook de React que te permite ejecutar código cuando una propiedad de estado se actualiza. Se le conoce como un \"efecto secundario\" y se usa para realizar tareas como realizar peticiones HTTP, suscribirse a una API externa y administrar sesiones del usuario.\nYo: `,
    temperature: 0.9,
    max_tokens: 150,
    apiKey: ''
})

const actions = {
    async getModels() {
        if (!state.apiKey) return
        const data = await fetch('https://api.openai.com/v1/models',
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.apiKey}` } }
        )
        try {
            const statusCode = data.status
            if (statusCode !== 200) return false
            const jsonData = await data.json()
            const chtgptResponse = jsonData.data
            const modelsIds = chtgptResponse.map(m => m.id).sort((a, b) => a.localeCompare(b))
            state.allModels = modelsIds
            return modelsIds


        } catch (error) {
            console.log('error getting models:', error);
            state.allModels = undefined
            return false
        }
    },
    async getCompletions() {
        const openAiOpts =
        {
            model: state.selectedModel,
            prompt: state.prompt,
            temperature: state.temperature,
            max_tokens: state.max_tokens,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Yo:", " Senior Dev:"],
            user: 'reactjsnewbie'
        }

        const fetchOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.apiKey}` },
            body: JSON.stringify(openAiOpts)
        };

        const data = await fetch('https://api.openai.com/v1/completions', fetchOpts)
        const jsonData = await data.json()
        const chtgptResponse = jsonData.choices[0].text
        return chtgptResponse
    },
    getAllModels() { return state.allModels },
    getApiKey() { return state.apiKey },
    getPrompt() { return state.prompt },
    getTemperature() { return state.temperature },
    getMaxTokens() { return state.max_tokens },
    getAllModels() { return state.allModels },

    setSelectedModel(model) { state.selectedModel = model },
    setApiKey(apiKey) { state.apiKey = apiKey },
    setPrompt(prompt) { state.prompt = prompt },
    setTemperature(temp) { state.temperature = temp },
    setMaxTokens(maxTokens) { state.max_tokens = maxTokens },
    setAllModels(allModels) { state.allModels = allModels }
}

export default {
    state: readonly(state),
    actions,
}
