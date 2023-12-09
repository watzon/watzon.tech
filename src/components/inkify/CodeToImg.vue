<template>
    <div>
        <div class="w-full mb-4" v-if="imgUrl">
            <a :href="imgUrl" target="_blank">
                <img :src="imgUrl" class="w-full" />
            </a>
        </div>
        <div class="flex justify-center items-center border-4 border-dashed h-32 w-full mb-4" v-else>
            Image will appear here
        </div>
        <div class="flex flex-col gap-4">
            <textarea v-model="code" class="bg-gray-300 dark:bg-gray-800 w-full h-32 p-2 font-mono" placeholder="// Put some code here"></textarea>
            <div class="flex flex-row justify-between items-center">
                <select class="bg-gray-300 dark:bg-gray-800 text-black dark:text-white font-bold py-2 px-4 rounded" v-model="theme">
                    <option v-for="theme in themes" :value="theme">{{ theme }}</option>
                </select>
                <button @click="inkifyRequest" class="bg-blue-500 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded">
                    Submit Code
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const code = ref<string>('')
const theme = ref<string>('Nord')
const imgUrl = ref<string | undefined>(undefined)

const windowTitle = "Inkify"
const pad_horiz = 20;
const pad_vert = 20;
const font = "Monaspace Neon=32"

const themes = [
  "1337",
  "Coldark-Cold",
  "Coldark-Dark",
  "DarkNeon",
  "Dracula",
  "GitHub",
  "Monokai Extended",
  "Monokai Extended Bright",
  "Monokai Extended Light",
  "Monokai Extended Origin",
  "Nord",
  "OneHalfDark",
  "OneHalfLight",
  "Solarized (dark)",
  "Solarized (light)",
  "Sublime Snazzy",
  "TwoDark",
  "Visual Studio Dark+",
  "gruvbox-dark",
  "gruvbox-light",
  "zenburn"
]

const inkifyRequest = () => {
    const encodedCode = encodeURIComponent(code.value)
    const endpoint = `https://inkify.0x45.st/generate?code=${encodedCode}&theme=${theme.value}&window_title=${windowTitle}&pad_horiz=${pad_horiz}&pad_vert=${pad_vert}&font=${font}`
    imgUrl.value = endpoint
}
</script>