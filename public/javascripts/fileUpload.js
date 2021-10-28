const rootStyles= window.getComputedStyle(document.documentElement)

if(rootStyles.getPropertyValue('--recipe-image-width-large') != null && rootStyles.getPropertyValue('--recipe-image-width-large') !== ''){
    ready()
}else{
    document.getElementById('main-css').addEventListener('load', ready)
}

function ready(){
    const imageWidth = parseFloat(rootStyles.getPropertyValue('--recipe-image-width-large'))
    const imageAspectRatio = parseFloat(rootStyles.getPropertyValue('--recipe-image-aspect-ratio'))
    const imageHeight = imageWidth/ imageAspectRatio
    FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 1 / imageAspectRatio,
        imageResizeTargetWidth: imageWidth,
        imageResizeTargetHeight: imageHeight
    })

    FilePond.parse(document.body)
}

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

FilePond.parse(document.body);