// 参数src为图片地址，name为下载时图片的名称
export const downloadIamge = function (src, name) {
    var image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous")
    image.onload = function () {
        let canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height

        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL("image/png")

        // 生成一个a元素
        let a = document.createElement("a")
        // 创建一个单击事件
        const event = new MouseEvent("click")

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || "下载图片名称"
        // 将生成的URL设置为a.href属性
        a.href = url

        // 触发a的单击事件
        a.dispatchEvent(event)
    }

    image.src = `${src}?${new Date().getTime()}`
}
