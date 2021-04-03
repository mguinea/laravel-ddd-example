<template>
    <div>
        <div class="flex flex-col p-2 py-6 m-h-screen">

            <div class="flex flex-col gap-4 lg:p-4 p-2  rounde-lg m-2">
                <div class="lg:text-2xl md:text-xl text-lg lg:p-3 p-1 font-black text-gray-700">Boards</div>
                <p v-if="$fetchState.pending">Fetching boards...</p>
                <p v-else-if="$fetchState.error">An error occurred :(</p>
                <div v-else>
                    <div v-for="board of response.boards" class="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full hover:bg-gray-100 cursor-pointer border-2 rounded-lg">
                        <div class="lg:flex md:flex items-center">
                            <div class="h-12 w-12 mb-2 lg:mb-0 border md:mb-0 rounded-full mr-3"></div>
                            <div class="flex flex-col">
                                <div class="text-sm leading-3 text-gray-700 font-bold w-full">
                                    {{ board.name }}
                                </div>
                                <div class="text-xs text-gray-600 w-full">
                                    #{{ board.id }}
                                </div>
                            </div>
                        </div>

                        <svg class="h-6 w-6 mr-1 invisible md:visible lg:visible xl:visible"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <button @click="$fetch">Refresh</button>
            </div>
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
