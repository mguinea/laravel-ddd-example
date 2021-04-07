<template>
    <div>
        <div class="flex flex-col p-2 py-6 m-h-screen">
            <div class="lg:text-2xl md:text-xl text-lg lg:p-3 p-1 font-black text-gray-700">Boards</div>
            <p v-if="$fetchState.pending">Fetching boards...</p>
            <p v-else-if="$fetchState.error">An error occurred :(</p>
            <div v-else>
                <div v-for="board of response.boards">
                    <div class="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        <div class="card m-2 cursor-pointer border border-gray-400 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200">
                            <div class="m-3">
                                <h2 class="text-lg mb-2">{{ board.name }}
                                    <span class="text-sm text-teal-800 font-mono bg-teal-100 inline rounded-full px-2 align-top float-right animate-pulse">
                                        Tag
                                    </span>
                                </h2>
                                <p class="font-light font-mono text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">
                                    #{{ board.id }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="$fetch">Refresh</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            response: {}
        }
    },
    async fetch() {
        this.response = await fetch(
            process.env.baseUrl + 'kanban/boards'
        ).then(res => res.json())
    }
}
</script>
