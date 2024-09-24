/**
 * @file renderLayout.js
 * @description Render layout with HTML template and named slot
 * @version 0.9.0
 * @license MIT
 * @author ksk1015
 */

/**
 * @param {string | (() => string)} layout
 */
function renderLayout(layout) {
  const render = () => {
    const body = document.body

    // Extract templates and contents from body
    const templates = []
    const bodyContents = document.createDocumentFragment()
    while (body.firstChild) {
      if (body.firstChild instanceof HTMLTemplateElement) {
        templates.push(body.firstChild)
        body.firstChild.remove()
      } else {
        bodyContents.appendChild(body.firstChild)
      }
    }

    // Layout html string to node
    const layoutNode = document
      .createRange()
      .createContextualFragment(
        typeof layout === 'function' ? layout() : layout
      )

    // Named slot tag replaces with template contents
    // No named slot tag replaces with body contents
    layoutNode.querySelectorAll('slot').forEach((slot) => {
      if (slot.name) {
        const template = templates.find((tpl) => tpl.id === slot.name)
        slot.replaceWith(template ? template.content : '')
      } else {
        slot.replaceWith(bodyContents)
      }
    })

    body.appendChild(layoutNode)
    body.dispatchEvent(new Event('renderLayoutRendered', { bubbles: true }))
  }

  // Check if document is ready not using document.readyState
  const hasReady = () => {
    return document.body && document.body.firstChild !== document.body.lastChild
  }

  // Render immediately if body has multiple children
  if (hasReady()) {
    return render()
  }

  // Render on document.readyState change to interactive
  const onReadyStateChange = () => {
    cancelAnimationFrame(frameId)
    render()
  }
  document.addEventListener('readystatechange', onReadyStateChange, {
    once: true,
  })

  // Chrome Browser, it's better to use requestAnimationFrame
  const frameId = requestAnimationFrame(() => {
    if (hasReady()) {
      document.removeEventListener('readystatechange', onReadyStateChange)
      render()
    }
  })
}

// Call renderLayout automatically
// if this script is sync loaded and has a data-path attribute
// <script src="renderLayout.js" data-path="layout.html"></script>
;(function () {
  const currentScript = document.currentScript
  if (!currentScript) return
  const dataPath = currentScript.dataset.path
  if (!dataPath) return

  // Convert dataPath to absolute URL and check same-origin
  const layoutPath = new URL(dataPath, location.href).href.replace(
    new RegExp(`^${location.origin}`),
    ''
  )
  const isSameOrigin = layoutPath.startsWith('/')
  if (!isSameOrigin) {
    throw new Error(`data-path must be a same-origin URL: ${layoutPath}`)
  }

  const cacheKey = `renderLayoutJsCache:${layoutPath}`

  // Use cache if the page is not reloaded
  const navTiming = performance.getEntriesByType('navigation')[0]
  if (navTiming.type !== 'reload') {
    const cache = sessionStorage.getItem(cacheKey)
    if (cache) {
      return renderLayout(cache)
    }
  }

  // Fetch layout data synchronously
  const xhr = new XMLHttpRequest()
  xhr.open('GET', layoutPath, false)
  xhr.send()
  if (xhr.status !== 200) {
    throw new Error(`Failed to fetch layout: ${layoutPath}`)
  }
  const data = xhr.responseText

  sessionStorage.setItem(cacheKey, data)
  renderLayout(data)
})()
