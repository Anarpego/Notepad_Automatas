import Vue from 'vue'
import VueQuillEditor, { Quill } from "vue-quill-editor";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from '@appsflare/quill-image-resize-module'
import QuillEmoji from 'quill-emoji'
import "quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

/*
const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);
*/


Quill.register({
    'modules/imageDrop': ImageDrop,
    'modules/imageResize': ImageResize,
    'modules/emoji': QuillEmoji
});

Vue.use(VueQuillEditor)