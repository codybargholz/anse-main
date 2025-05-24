import { Match, Switch, createSignal, onMount, createEffect } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { currentErrorMessage, isSendBoxFocus, scrollController } from '@/stores/ui'
import { addConversation, conversationMap, currentConversationId } from '@/stores/conversation'
import { loadingStateMap, streamsMap } from '@/stores/streams'
import { handlePrompt } from '@/logics/conversation'
import { globalAbortController } from '@/stores/settings'
import { useI18n, useMobileScreen } from '@/hooks'
import Button from './ui/Button'

export default () => {
  const { t } = useI18n()
  let inputRef: HTMLTextAreaElement
  const $conversationMap = useStore(conversationMap)
  const $currentConversationId = useStore(currentConversationId)
  const $isSendBoxFocus = useStore(isSendBoxFocus)
  const $currentErrorMessage = useStore(currentErrorMessage)
  const $streamsMap = useStore(streamsMap)
  const $loadingStateMap = useStore(loadingStateMap)
  const $globalAbortController = useStore(globalAbortController)

  const [inputPrompt, setInputPrompt] = createSignal('')
  const [footerClass, setFooterClass] = createSignal('')
  const [textareaHeight, setTextareaHeight] = createSignal(56) // Base height in pixels
  
  const isEditing = () => inputPrompt() || $isSendBoxFocus()
  const currentConversation = () => {
    return $conversationMap()[$currentConversationId()]
  }
  const isStreaming = () => !!$streamsMap()[$currentConversationId()]
  const isLoading = () => !!$loadingStateMap()[$currentConversationId()]
  const hasContent = () => inputPrompt().trim().length > 0

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    // Reset height to get accurate scrollHeight
    element.style.height = '56px'
    const scrollHeight = element.scrollHeight
    
    // Calculate new height with constraints
    const minHeight = 56
    const maxHeight = 280
    const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight))
    
    element.style.height = `${newHeight}px`
    setTextareaHeight(newHeight)
  }

  onMount(() => {
    createShortcut(['Control', 'Enter'], () => {
      $isSendBoxFocus() && handleSend()
    })

    createShortcut(['Meta', 'Enter'], () => {
      $isSendBoxFocus() && handleSend()
    })

    useMobileScreen(() => {
      setFooterClass('sticky bottom-0 left-0 right-0 overflow-hidden')
    })
  })

  // Auto-adjust height when content changes
  createEffect(() => {
    if (inputRef && inputPrompt()) {
      adjustTextareaHeight(inputRef)
    }
  })

  const stateType = () => {
    if ($currentErrorMessage())
      return 'error'
    else if (isLoading() || isStreaming())
      return 'loading'
    else if (isEditing())
      return 'editing'
    else
      return 'normal'
  }

  const EmptyState = () => (
    <div
      class="group relative max-w-base h-full fi flex-row gap-4 px-6 transition-all duration-300 hover:bg-base-100/50"
      onClick={() => {
        isSendBoxFocus.set(true)
        inputRef?.focus()
      }}
    >
      <div class="flex-1 text-sm text-gray-500 dark:text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
        {t('send.placeholder')}
      </div>
      <div class="opacity-40 transition-opacity group-hover:opacity-60">
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 fi justify-center">
          <div class="i-carbon-send text-white text-sm" />
        </div>
      </div>
    </div>
  )

  const EditState = () => (
    <div class="relative bg-base-100/30 backdrop-blur-sm border-t border-base transition-all duration-300">
      {/* Main input container */}
      <div 
        class="relative max-w-base mx-auto"
        style={{ "min-height": `${Math.max(textareaHeight(), 56)}px` }}
      >
        {/* Textarea */}
        <textarea
          ref={inputRef!}
          placeholder={t('send.placeholder')}
          autocomplete="off"
          value={inputPrompt()}
          onFocus={() => {
            isSendBoxFocus.set(true)
            adjustTextareaHeight(inputRef)
          }}
          onBlur={() => {
            if (!inputPrompt().trim()) {
              isSendBoxFocus.set(false)
            }
          }}
          onInput={(e) => {
            setInputPrompt(e.currentTarget.value)
            adjustTextareaHeight(e.currentTarget)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.isComposing && !e.shiftKey && hasContent()) {
              e.preventDefault()
              handleSend()
            }
          }}
          class="w-full resize-none border-0 bg-transparent px-6 py-4 pr-16 text-sm leading-6 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200"
          style={{ height: `${textareaHeight()}px` }}
        />
        
        {/* Send button - positioned absolutely to float over textarea */}
        <div class="absolute right-3 bottom-3 transition-all duration-200">
          <button
            onClick={handleSend}
            disabled={!hasContent()}
            class={`
              group relative overflow-hidden rounded-xl p-2.5 transition-all duration-300 transform
              ${hasContent() 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {/* Animated background for active state */}
            {hasContent() && (
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            
            {/* Icon */}
            <div class={`
              relative z-10 transition-transform duration-200
              ${hasContent() ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}
            `}>
              <div class="i-carbon-send text-lg" />
            </div>
            
            {/* Ripple effect */}
            {hasContent() && (
              <div class="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 bg-white transition-opacity duration-150" />
            )}
          </button>
        </div>
      </div>
      
      {/* Bottom hint bar */}
      <div class="max-w-base mx-auto px-6 pb-3">
        <div class="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <div class="flex items-center gap-4">
            <span class="fi gap-1">
              <div class="i-carbon-keyboard text-xs" />
              <span>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to send</span>
            </span>
            <span class="fi gap-1">
              <div class="i-carbon-return text-xs" />
              <span>Shift + Enter for new line</span>
            </span>
          </div>
          <div class="text-right opacity-60">
            {inputPrompt().length > 0 && (
              <span>{inputPrompt().length} characters</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const ErrorState = () => (
    <div class="max-w-base mx-auto h-full flex items-center justify-between gap-4 px-6 py-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
          <div class="i-carbon-warning-filled text-lg" />
          <span class="font-semibold text-sm">{$currentErrorMessage()?.code}</span>
        </div>
        <div class="text-sm text-red-600 dark:text-red-300 leading-relaxed">
          {$currentErrorMessage()?.message}
        </div>
      </div>
      <button
        class="px-3 py-1.5 text-sm border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
        onClick={() => { currentErrorMessage.set(null) }}
      >
        Dismiss
      </button>
    </div>
  )

  const LoadingState = () => (
    <div class="max-w-base mx-auto h-full fi flex-row gap-4 px-6">
      <div class="flex items-center gap-3 flex-1">
        {/* Modern loading animation */}
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ "animation-delay": "0ms" }} />
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ "animation-delay": "150ms" }} />
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ "animation-delay": "300ms" }} />
        </div>
        <span class="text-sm text-gray-600 dark:text-gray-300">Processing your request...</span>
      </div>
      <button
        class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => { handleAbortFetch() }}
      >
        Stop
      </button>
    </div>
  )

  const clearPrompt = () => {
    setInputPrompt('')
    isSendBoxFocus.set(false)
    if (inputRef) {
      inputRef.style.height = '56px'
      setTextareaHeight(56)
    }
  }

  const handleAbortFetch = () => {
    $globalAbortController()?.abort()
    clearPrompt()
  }

  const handleSend = () => {
    const content = inputPrompt().trim()
    if (!content) return
    
    if (!currentConversation())
      addConversation()

    const controller = new AbortController()
    globalAbortController.set(controller)
    handlePrompt(currentConversation(), content, controller.signal)
    clearPrompt()
    scrollController().scrollToBottom()
  }

  const stateRootClass = () => {
    const baseClasses = 'relative shrink-0 transition-all duration-300 z-10'
    
    if (stateType() === 'normal')
      return `${baseClasses} border-t border-base hover:bg-base-100/20`
    else if (stateType() === 'error')
      return `${baseClasses} border-t border-red-200 dark:border-red-800`
    else if (stateType() === 'loading')
      return `${baseClasses} border-t border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10`
    else if (stateType() === 'editing')
      return `${baseClasses}`
    return baseClasses
  }

  const stateHeightClass = () => {
    if (stateType() === 'normal')
      return 'h-16'
    else if (stateType() === 'error')
      return 'min-h-16'
    else if (stateType() === 'loading')
      return 'h-16'
    else if (stateType() === 'editing')
      return '' // Dynamic height based on content
    return ''
  }

  return (
    <div class={`${stateRootClass()} ${footerClass()} pb-[env(safe-area-inset-bottom)]`}>
      <div class={`${stateHeightClass()}`}>
        <Switch fallback={<EmptyState />}>
          <Match when={stateType() === 'error'}>
            <ErrorState />
          </Match>
          <Match when={stateType() === 'loading'}>
            <LoadingState />
          </Match>
          <Match when={stateType() === 'editing'}>
            <EditState />
          </Match>
        </Switch>
      </div>
    </div>
  )
}
