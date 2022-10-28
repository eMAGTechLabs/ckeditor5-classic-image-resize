import Command from '@ckeditor/ckeditor5-core/src/command';
/**
 * The image resize command. Currently, it supports both the width and the height attributes.
 */
export default class ImageMaxWidthCommand extends Command {

    constructor( editor ) {
        super( editor );
        this.value = null;
    }

    init() {
        this.refresh();
    }

    /**
     * @inheritDoc
     */
    refresh() {
        const imageUtils = this.editor.plugins.get( 'ImageUtils' );
        const element = this.editor.model.document.selection.getSelectedElement();
        this.isEnabled = imageUtils.isImage( element );

        let width = this.getMaxWidth( element );

        if (width) {
            this.value = {
                'max-width': width
            };
        } else {
            this.value = null;
        }
    }

    getMaxWidth(element) {
        let width = null;
        if ( element && element.hasAttribute( 'max-width' ) ) {
            width = element.getAttribute( 'max-width' );
        }
        return Number(width);
    }

    /**
     * Executes the command.
     * @param {Object} options
     * @param {String|null} options['max-width'] The max-width of the image.
     */
    execute( options ) {
        const model = this.editor.model;
        const imageElement = model.document.selection.getSelectedElement();

        model.change( writer => {
            if (options['max-width']) {
                writer.setAttribute(
                    'max-width',
                    options['max-width'],
                    imageElement
                )
            } else {
                writer.removeAttribute('max-width', imageElement);
            }
        });

        this.refresh();
    }
}
