import { reactive, readonly } from 'vue'

const state = reactive({
    allModels: undefined,
    chatHistory: undefined,
    selectedModel: 'text-davinci-003',
    prompt: 'Say this is a test',
    temperature: 0,
    max_tokens: 25,
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
            max_tokens: state.max_tokens
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
