import { createRouter, createWebHistory } from "vue-router"
import useLayoutStore from "../store/layout.store"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            name: "home",
            path: "/",
            component: () => import("../view/HomeView.vue"),
            meta: {
                title: "Trang Chủ"
            }
        },

        {
            name: "add-music",
            path: "/add-music",
            component: () => import("../view/AddMusicView.vue"),
            meta: {
                title: "Thêm Nhạc"
            }
        },

        {
            name: "music",
            path: "/music",
            component: () => import("../view/ListMusicView.vue"),
            meta: {
                title: "Danh Sách Nhạc"
            }
        },

        {
            name: "setting",
            path: "/setting",
            component: () => import("../view/SettingView.vue"),
            meta: {
                title: "Cài Đặt"
            }
        },

        {
            path: "/:pathMatch(.*)*",
            name: "404",
            component: () => import("../view/404View.vue"),
            meta: {
                title: "Không tìm thấy trang"
            }
        }
    ],

    scrollBehavior(_to, _from, savedPosition) {
        return new Promise((resolve) => {
            // setTimeout(() => {
                if (savedPosition) {
                    resolve(savedPosition)
                }
                else {
                    resolve({ top: 0 })
                }
            // }, 300)
        })
    }
})

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
    const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)
    const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)
    let title: string = ""

    if (nearestWithTitle) {
        if (typeof nearestWithTitle.meta.title === "string") {
            title = nearestWithTitle.meta.title
        }
    } else if (previousNearestWithMeta) {
        if (typeof previousNearestWithMeta.meta.title === "string") {
            title = previousNearestWithMeta.meta.title
        }
    }

    let layoutStore = useLayoutStore()
    layoutStore.setTitle(title)
    layoutStore.closeMenu()

    Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(el => el.parentNode?.removeChild(el))

    if (!nearestWithMeta || !Array.isArray(nearestWithMeta.meta.metaTags)) return next()

    nearestWithMeta.meta.metaTags.map((tagDef) => {
        const tag: HTMLElement = document.createElement("meta")

        Object.keys(tagDef).forEach((key: string) => {
            tag.setAttribute(key, tagDef[key])
        })

        tag.setAttribute("data-vue-router-controlled", "")

        return tag
    }).forEach((tag: HTMLElement) => document.head.appendChild(tag))

    next()
})

export default router