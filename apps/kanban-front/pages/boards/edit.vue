<template>
    <div id="app">
        <div class="flex justify-center">
            <div class="min-h-screen flex overflow-x-scroll py-12">
                <div
                    v-for="column in columns"
                    :key="column.title"
                    class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
                >
                    <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{column.title}}</p>
                    <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                    <draggable :list="column.tasks" :animation="200" ghost-class="ghost-card" group="tasks">
                        <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                        <TaskCard
                            v-for="(task) in column.tasks"
                            :key="task.id"
                            :task="task"
                            class="mt-3 cursor-move"
                        ></TaskCard>
                        <!-- </transition-group> -->
                    </draggable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import TaskCard from "~/components/TaskCard";
export default {
    name: "App",
    components: {
        TaskCard,
        draggable
    },
    data() {
        return {
            columns: [
                {
                    title: "Backlog",
                    tasks: [
                        {
                            id: 1,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        },
                        {
                            id: 2,
                            title: "Provide documentation on integrations",
                            date: "Sep 12"
                        },
                        {
                            id: 3,
                            title: "Design shopping cart dropdown",
                            date: "Sep 9",
                            type: "Design"
                        },
                        {
                            id: 4,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        },
                        {
                            id: 5,
                            title: "Test checkout flow",
                            date: "Sep 15",
                            type: "QA"
                        }
                    ]
                },
                {
                    title: "In Progress",
                    tasks: [
                        {
                            id: 6,
                            title: "Design shopping cart dropdown",
                            date: "Sep 9",
                            type: "Design"
                        },
                        {
                            id: 7,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        },
                        {
                            id: 8,
                            title: "Provide documentation on integrations",
                            date: "Sep 12",
                            type: "Backend"
                        }
                    ]
                },
                {
                    title: "Review",
                    tasks: [
                        {
                            id: 9,
                            title: "Provide documentation on integrations",
                            date: "Sep 12"
                        },
                        {
                            id: 10,
                            title: "Design shopping cart dropdown",
                            date: "Sep 9",
                            type: "Design"
                        },
                        {
                            id: 11,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        },
                        {
                            id: 12,
                            title: "Design shopping cart dropdown",
                            date: "Sep 9",
                            type: "Design"
                        },
                        {
                            id: 13,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        }
                    ]
                },
                {
                    title: "Done",
                    tasks: [
                        {
                            id: 14,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        },
                        {
                            id: 15,
                            title: "Design shopping cart dropdown",
                            date: "Sep 9",
                            type: "Design"
                        },
                        {
                            id: 16,
                            title: "Add discount code to checkout page",
                            date: "Sep 14",
                            type: "Feature Request"
                        }
                    ]
                }
            ]
        };
    }
};
</script>

<style scoped>
.column-width {
    min-width: 320px;
    width: 320px;
}
/* Unfortunately @apply cannot be setup in codesandbox,
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
    opacity: 0.5;
    background: #F7FAFC;
    border: 1px solid #4299e1;
}
</style>
