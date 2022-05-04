function createSpan(text) {
    const li = document.createElement("span")
    li.innerText = text
    return li
}

function spaceFirstElementOutByClass(className) {
    const element = document.getElementsByClassName("space-out")[0]

    const currentText = element.innerText
    element.innerHTML = ""

    console.log({currentText})

    for (let i = 0; i < currentText.length; i++) {
        const text = currentText[i]
        const li = createSpan(text)

        console.log("in loop", {currentText})
    
        console.log("appending", text, "as", li)
    
        element.appendChild(li)
    }
}

spaceFirstElementOutByClass("space-out")