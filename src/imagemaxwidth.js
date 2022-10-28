import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageMaxWidthEditing from "./imagemaxwidth/imagemaxwidthediting";
import ImageMaxWidthUi from "./imagemaxwidth/imagemaxwidthui";

export default class ImageMaxWidth extends Plugin {

    static get requires() {
        return [ ImageMaxWidthEditing, ImageMaxWidthUi ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageMaxWidth';
    }
}
