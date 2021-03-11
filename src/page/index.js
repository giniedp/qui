(function() {
  function formatText(text) {
    var lines = text.split(/\n/gi).filter((it) => it.trim())
    var indent = Number.MAX_VALUE
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        indent = Math.min(indent, lines[i].match(/^\s*/)[0].length)
      }
    }
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        lines[i] = lines[i].substr(indent)
      }
    }
    return lines.join("\n")
  }

  document.querySelectorAll("aside.language-html,script.language-javascript,style.language-css").forEach((node) => {
    let pre = document.createElement('pre')
    let code = document.createElement('code')
    pre.appendChild(code)
    code.textContent = formatText(node.innerHTML)
    code.setAttribute("class", node.getAttribute("class"))
    node.parentNode.insertBefore(pre, node.nextSibling)
  })
})()
