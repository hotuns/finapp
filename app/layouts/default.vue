<script setup lang="ts">
import { useMagicKeys, useStorage, useWindowSize } from '@vueuse/core'

import { useAppNav } from '~/components/app/useAppNav'
import { useInitApp } from '~/components/app/useInitApp'
import { useCategoriesStore } from '~/components/categories/useCategoriesStore'
import { useDemo } from '~/components/demo/useDemo'
import { useTrnsFormStore } from '~/components/trnForm/useTrnsFormStore'
import { useTrnsStore } from '~/components/trns/useTrnsStore'
import { useUserStore } from '~/components/user/useUserStore'
import { useWalletsStore } from '~/components/wallets/useWalletsStore'

const keepalive = ['Categories', 'CategoriesId', 'Wallets', 'WalletsId', 'Dashboard']

const categoriesStore = useCategoriesStore()
const trnsFormStore = useTrnsFormStore()
const userStore = useUserStore()
const walletsStore = useWalletsStore()
const trnsStore = useTrnsStore()
const { isDemo } = useDemo()
const { isModalOpen } = useAppNav()
const { loadDataFromCache, loadDataFromDB } = useInitApp()
const { t } = useI18n()
const { width } = useWindowSize()

const isShowSidebar = useStorage('isShowSidebar', true)

const { error, status } = await useAsyncData(
  'app',
  async () => {
    const localAuthUid = await useCookie('finapp.localAuthUid')

    if (isDemo.value) {
      await loadDataFromCache()
    }
    else if (userStore.currentUser || localAuthUid.value) {
      await loadDataFromCache()
      loadDataFromDB()
    }
  },
  {
    lazy: false,
    server: false,
  },
)

const { escape, shift_d, shift_s } = useMagicKeys()

watch(shift_s!, (v) => {
  if (v) {
    if (trnsFormStore.ui.isShow)
      trnsFormStore.ui.isShow = false
    else
      trnsFormStore.trnFormCreate()
  }
})

watch(escape!, (v) => {
  if (trnsFormStore.ui.isShow && v)
    trnsFormStore.ui.isShow = false
})

watch(shift_d!, (v) => {
  if (v)
    isShowSidebar.value = !isShowSidebar.value
})

usePageScroll()
</script>

<template>
  <div
    data-vaul-drawer-wrapper
    :class="{ 'md:translate-x-20': trnsFormStore.ui.isShow && isShowSidebar && width >= 767 }"
    class="h-dvh overflow-hidden transition-all duration-300 ease-in-out"
    style="margin-left: env(safe-area-inset-left)"
  >
    <div v-if="status === 'error'">
      <pre>{{ error }}</pre>
    </div>

    <div v-else-if="status === 'pending' || trnsStore.items === false || walletsStore.items === false">
      {{ t('base.loading') }}
    </div>

    <template v-else-if="status === 'success'">
      <LayoutSidebar
        :isShowTrnForm="trnsFormStore.ui.isShow"
        :isShowSidebar
        @toggleSidebar="isShowSidebar = !isShowSidebar"
      />

      <div
        class="grid h-full overflow-hidden md:p-4 sm:pl-12 md:pl-12"
        :class="{
          'sm:pl-74 md:pl-74': isShowSidebar && width >= 767,
        }"
      >
        <div class="relative h-full overflow-hidden sm:rounded-2xl bg-[var(--ui-bg)] sm:border sm:border-item-4 max-w-5xl">
          <main
            id="pageScroll"
            style="padding-bottom: calc(50px + env(safe-area-inset-bottom))"
            class="@container/main grid h-full overflow-hidden overflow-y-auto"
          >
            <NuxtPage :keepalive="{ include: keepalive }" />
          </main>

          <TrnFormFloatOpener />
        </div>
      </div>

      <!-- Menu -->
      <LayoutMenuBottom />
      <LayoutMenuBottomModal v-if="isModalOpen('menu')" />
    </template>

    <Teleport
      v-if="categoriesStore.hasItems && walletsStore.hasItems"
      to="body"
    >
      <TrnFormBottom v-if="width < 767" />
      <TrnFormSidebar v-if="width >= 767" />
    </Teleport>
  </div>
</template>
