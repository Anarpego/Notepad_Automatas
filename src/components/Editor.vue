<template>
  <div class="editor">
    <img  src="../../public/add.png" @click="newFile" width="40" height="50" title="Nuevo Archivo"/>
    <img src="../../public/open.png" @click="openFile" width="40" height="50" title="Abrir Archivo"/>
    <img src="../../public/save.png" @click="saveFile" width="40" height="50" title="Guardar Archivo"/>
    <img src="../../public/saveAs.png" @click="saveFileAs" width="40" height="50" title="Guardar Archivo Como"/>

    <nav role="navigation">
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <label for="opt"> ⎌ Automatas ⎌</label>
          <a href="#" @click="variableAssing"><li>↝ Asignación de variables</li></a>
          <a href="#" @click="numReal"><li>↝ Números Reales</li></a>
          <a href="#" @click="evaluateVariable"><li>↝ Evaluación de variables</li></a>
          <a href="#" @click="rationalNumber"><li>↝ Números racionales</li></a>
          <a href="#" @click="zeroAnOnes"><li>↝ 0´s y 1´s</li></a>
          <a href="#" @click="cleanLog"><li>Limpiar log de errores</li></a>
        </ul>
      </div>
    </nav>
    <textarea class="text-area" cols="100" rows="30"
      v-model="content"
      :options="editorOption"
    ></textarea>
    <pre class="error-log"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";
import { remote } from "electron";
import "highlight.js/styles/monokai-sublime.css";
import "bulma/css/bulma.min.css";
import fs, { stat } from "fs";
import Quill from "quill";
import { isNumber } from "util";

const quill = require("quill");

export default {
  name: "Editor",
  data() {
    return {
      oncePath: "",
      content: "",
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["emoji"],
              ["clean"],
              ["link", "image", "video"]
            ],
            handlers: { emoji: function() {} }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          },
          imageDrop: true,
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          "emoji-toolbar": true,
          "emoji-shortname": true
        }
      }
    };
  },
  methods: {
    newFile() {
      //let question = confirm("¿DESEA GUARDAR?");
      const context = this;
      const contexto = (context.content = null);
    },
    openFile() {
      const [filepath] = remote.dialog.showOpenDialog({
        properties: ["openFile"]
      });
      const context = this;

      if (filepath === undefined) {
        alert(
          "No se ha seleccionado ningún archivo o el formato no es compatible."
        );
        return;
      }
      fs.readFile(filepath, "utf-8", (err, data) => {
        if (err) {
          alert(
            "Ha ocurrido un error al intentar abrir el archivo:" + err.message
          );
          return;
        }
        context.content = data;
      });
    },
    saveFile() {
      if (this.oncePath == '') {
      const filenameToSave = remote.dialog.showSaveDialog();
      const filePathToSave = filenameToSave.includes(".txt")
        ? filenameToSave
        : `${fileToSave}.txt`;
        this.oncePath =  filePathToSave;
      fs.writeFile(filePathToSave, this.content, err => {
        if (err) throw err;
        alert("Archivo Guardado");
      });
      } 
        fs.writeFile(this.oncePath, this.content, err => {
        if (err) throw err;
        console.log("Archivo guardado");
      });
    },
    saveFileAs() {
      const filenameToSave = remote.dialog.showSaveDialog();
      const filePathToSave = filenameToSave.includes(".txt")
        ? filenameToSave
        : `${fileToSave}.txt`;
      this.oncePath =  filePathToSave;
      fs.writeFile(filePathToSave, this.content, err => {
        if (err) throw err;
        alert("Archivo Guardado");
      });
    },
    numReal() {
      
    const validateNumber = (n) => Number.isInteger(parseInt(n));
    let logerror = [];
    let contenido = this.content.split("\n");
    console.log(contenido);


    contenido.forEach(element => {
    let estado = 1;

      for(let i = 0; i < element.length; i++){
        let charx = element.charAt(i);
        console.log(charx);

        switch(estado){
          case 1:
                  if(validateNumber(charx)){
                    estado = 2;
                  }
                  break;
          case 2:
                if(validateNumber(charx)){
                    estado = 2;
                  }else if(charx == "."){
                    estado = 3;
                  }else if( charx == "E"){
                    estado = 5;
                  }
                  break;
          case 3:
                if(validateNumber(charx)){
                    estado = 4;
                  }
                  break;
          case 4:
                if(validateNumber(charx)){
                  estado = 4;
                }else if(charx == "E"){
                  estado = 5;
                }
                break;
         case 5:
                if(charx == "+"){
                  estado = 6;
                }else  if(charx == "-"){
                  estado = 6;
                }else if(validateNumber(charx)){
                  estado = 7;
                }
                break;
         case 6:
                if(validateNumber(charx)){
                  estado = 7;
                }
                break;
        case 7:
                if(validateNumber(charx)){
                  estado = 7;
                }
                break;
        }  
      }

         if (estado == 1 || estado == 2|| estado == 3 || estado == 5 || estado == 6){
            logerror.push(element);
         }  
      
    });
      let mostrarerror = "";
      contenido.forEach((element, i) => {
      for(let failed of logerror){
        if(element == failed){
        let linea =  i + 1;
        mostrarerror += `Error en la cadena: <mark> ${failed} </mark>, Linea: <mark> ${linea} </mark> \n`;
         }
       }
     })
          
       const errorlog = document.querySelector(".error-log");
      errorlog.innerHTML = mostrarerror;
      
    },
    variableAssing(){
     
    const validateNumber = (n) => Number.isInteger(parseInt(n));
    let logerror = [];
    let contenido = this.content.split("\n");
    console.log(contenido);


    contenido.forEach(element => {
    let estado = 1;

      for(let i = 0; i < element.length; i++){
        let charx = element.charAt(i);
        console.log(charx);

        switch(estado){
          case 1:
                  if(/^[a-zA-Z]$/.test(charx)){
                    estado = 2;
                  }else if(validateNumber(charx)){
                    estado = 5;
                  }else if(charx == ":"){
                    estado = 3;
                  }
                  break;
          case 2:
                if(validateNumber(charx)){
                    estado = 2;
                    //console.log("ESTOY EN EL SWITCH");
                  }else if(/^[a-zA-Z]$/.test(charx)){
                    estado = 2;
                  } 
                  break;
          case 3:
                if(charx == "="){
                    estado = 4;
                  }
                  break;
          case 5:
                if(validateNumber(charx)){
                  estado = 5;
                }
                break;         
        }  
      }

         if (estado == 1 || estado == 3){
            logerror.push(element);
         }  
      
    });
         let mostrarerror = "";
         contenido.forEach((element, i) => {
         for(let failed of logerror){
            if(element == failed){
              let linea =  i + 1;
                mostrarerror += `Error en la cadena: <mark> ${failed} </mark>, Linea: <mark> ${linea} </mark> \n`;
                }
             }
           })
          
            const errorlog = document.querySelector(".error-log");
            errorlog.innerHTML = mostrarerror;
    
    
    },
    evaluateVariable(){
      
    const validateNumber = (n) => Number.isInteger(parseInt(n));
    let logerror = [];
    let contenido = this.content.split("\n");
    console.log(contenido);


    contenido.forEach(element => {
    let estado = 1;

      for(let i = 0; i < element.length; i++){
        let charx = element.charAt(i);
        console.log(charx);

        switch(estado){
          case 1:
                  if(/^[a-zA-Z]$/.test(charx)){
                    estado = 3;
                  }else if(validateNumber(charx)){
                    estado = 2;
                  }
                  break;
          case 3:
                if(/^[a-zA-Z]$/.test(charx)){
                  estado = 3;
                }else if(validateNumber(charx)){
                  estado = 3;
                }
                break;         
        }  
      }

         if (estado == 1 || estado == 2){
            logerror.push(element);
         }  
      
    });
            let mostrarerror = "";
           contenido.forEach((element, i) => {
           for(let failed of logerror){
              if(element == failed){
                let linea =  i + 1;
                mostrarerror += `Error en la cadena: <mark> ${failed} </mark>, Linea: <mark> ${linea} </mark> \n`;
                }
             }
           })
          
            const errorlog = document.querySelector(".error-log");
            errorlog.innerHTML = mostrarerror;
          
    },
    rationalNumber(){
     
    const validateNumber = (n) => Number.isInteger(parseInt(n));
    let logerror = [];
    let contenido = this.content.split("\n");
    console.log(contenido);


    contenido.forEach(element => {
    let estado = 0;

      for(let i = 0; i < element.length; i++){
        let charx = element.charAt(i);
        console.log(charx);

        switch(estado){
          case 0:
                  if(charx == "+" || charx == "-"){
                    estado = 1;
                  }else if(validateNumber(charx)){
                    estado = 2;
                  }
                  break;
          case 1:
                if(validateNumber(charx)){
                    estado = 2;   
                  }
                  break;
          case 2:
                if(validateNumber(charx)){
                    estado = 2;
                  }else if (charx == "."){
                    estado = 3;
                  }
                  break;
          case 3:
                if(validateNumber(charx)){
                  estado = 4;
                }
                break;   
          case 4:
              if(validateNumber(charx)){
                  estado = 4;
                }
                break;
        }  
      }
         if (estado == 0 || estado == 1 || estado == 2 || estado == 3){
            logerror.push(element);
         }  
      
    });
            let mostrarerror = "";
           contenido.forEach((element, i) => {
             for(let failed of logerror){
                if(element == failed){
                  let linea =  i + 1;
                  mostrarerror += `Error en la cadena: <mark> ${failed} </mark>, Linea: <mark> ${linea} </mark> \n`;
                }
             }
           })
          
            const errorlog = document.querySelector(".error-log");
            errorlog.innerHTML = mostrarerror;
      
    },
    zeroAnOnes(){
        
    const validateNumber = (n) => Number.isInteger(parseInt(n));
    let logerror = [];
    let contenido = this.content.split("\n");
    //console.log(contenido);


    contenido.forEach(element => {
    let estado = 0;

      for(let i = 0; i < element.length; i++){
        let charx = element.charAt(i);
       // console.log(charx);

        switch(estado){
          case 0:
                  if(charx == "0"){
                    estado = 1;
                  }else if(charx == "1"){
                    estado = 3;
                  }
                  break;
          case 1:
                if(charx == "0"){
                    estado = 2;
                    //console.log("ESTOY EN EL SWITCH");
                  }else if(charx == "1"){
                    estado = 3;
                  }
                  break;
          case 2:
                if(charx == "0"){
                    estado = 2;
                  }else if(charx == "1"){
                    estado = 2;
                  }
                  break;
          case 3:
                if(charx == "0"){
                  estado = 3;
                }else if(charx == "1"){
                  estado = 3;
                }
                break;         
        }  
      }

         if (estado == 2){
            logerror.push(element);
         }  
      
    });
           let mostrarerror = "";
           contenido.forEach((element, i) => {
             for(let failed of logerror){
                if(element == failed){
                  let linea =  i + 1;
                  mostrarerror += `Error en la cadena: <mark> ${failed} </mark>, Linea: <mark> ${linea} </mark> \n`;
                }
             }
           })
          
            const errorlog = document.querySelector(".error-log");
            errorlog.innerHTML = mostrarerror;
    
    },
    cleanLog() {
      const errorlog = document.querySelector(".error-log");
      errorlog.innerHTML = "";
      console.log("ERROR LOG LIMPIADO");  
    },
    onEditorChange(txt) {


      this.content = txt;
    }
  }
};
</script>

<style>
textarea, .text-area{
  border: 1px solid #888; 
}

body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

img {
  margin-right: 2em;
  margin-top: 0.5rem;
}

a {
  text-decoration: none;
  color: #232323;

  transition: color 0.3s ease;
}

a:hover {
  color: tomato;
}

#menuToggle {
  display: block;
  position: absolute;
  top: 50px;
  right: 50px;

  z-index: 1;

  -webkit-user-select: none;
  user-select: none;
}

#menuToggle input {
  display: block;
  width: 40px;
  height: 32px;
  position: absolute;
  top: -5px;
  left: -5px;
  cursor: pointer;
  opacity: 0;
  z-index: 2;

  -webkit-touch-callout: none;
}

#menuToggle span {
  display: block;
  width: 33px;
  height: 4px;
  margin-bottom: 5px;
  position: relative;
  background: #cdcdcd;
  border-radius: 3px;
  z-index: 1;

  transform-origin: 4px 0px;

  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
}

#menuToggle span:first-child {
  transform-origin: 0% 0%;
}

#menuToggle span:nth-last-child(2) {
  transform-origin: 0% 100%;
}
#menuToggle input:checked ~ span {
  opacity: 1;
  transform: rotate(45deg) translate(-2px, -1px);
  background: #232323;
}
#menuToggle input:checked ~ span:nth-last-child(3) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}
#menuToggle input:checked ~ span:nth-last-child(2) {
  opacity: 1;
  transform: rotate(-45deg) translate(0, -1px);
}
#menu {
  position: fixed;
  width: 500px;
  margin: -100px 0 0 0;
  padding: 50px;
  padding-top: 125px;
  right: -100px;

  background: #ededed;
  list-style-type: none;
  -webkit-font-smoothing: antialiased;
  transform-origin: 0% 0%;
  transform: translate(100%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
}

#menu li {
  padding: 10px 0;
  font-size: 22px;
}

#menuToggle input:checked ~ ul {
  transform: none;
  opacity: 1;
}

@media screen and (max-width: 768px) {
  #menu {
    transform: none;
    opacity: 0;

    transition: opacity 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }
}

label {
  font-family: "Times New Roman", Times, serif;
  font-size: 2rem;
}

mark{
  font-family: "Arial Black", "Impact";
  font-size: 20px;
}

pre{
  font-size: 20px !important;
}
</style>
