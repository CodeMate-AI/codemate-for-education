
var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night");
    editor.session.setMode(`ace/mode/javascript`);
    editor.setShowPrintMargin(false);

    editor.setFontSize(20);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableCodeLens: true
    });



const env = {
    "enhanced_context": {
        "status": false,
        "element": document.getElementById("enhanced_context_toggle"),
    },
}


env.enhanced_context.element.onclick = ()=>{
    if(env.enhanced_context.status){
        env.enhanced_context.status = false;
        env.enhanced_context.element.classList.remove("ec-active", "ph-fill");
    }else{
        env.enhanced_context.status = true;
        env.enhanced_context.element.classList.add("ec-active", "ph-fill");
    }
}