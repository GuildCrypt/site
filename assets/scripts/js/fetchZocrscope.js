export default async function fetchZocrscope() {
  if (window.Zocrscope) {
    return window.Zocrscope
  }
  return new Promise((resolve, reject) => {
    const $script = document.createElement('script')
    $script.type = 'text/javascript'
    $script.onload = () => {
      resolve(window.Zocrscope)
    }
    $script.src = './bundle.js'
    document.body.appendChild($script)
  })
}
