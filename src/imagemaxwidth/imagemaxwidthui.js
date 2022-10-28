import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InputTextView from "@ckeditor/ckeditor5-ui/src/inputtext/inputtextview";

import '../../theme/image-max-width.css';

/**
 * The image style UI plugin.
 */
export default class ImageMaxWidthUi extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageResizeUI';
    }


    /**
     * @inheritDoc
     */
    init() {
        this._createInput();
    }


    /**
     * Creates an input for max-width and stores it in the editor
     * @private
     */
    _createInput() {
        const editor = this.editor;
        const componentName = `imageMaxWidth`;

        editor.ui.componentFactory.add( componentName, locale => {
            const command = editor.commands.get( 'imageMaxWidth' );
            const input = new InputTextView( locale );

            input.set( {
                placeholder: 'max-width',
            } );

            input.extendTemplate({
                attributes: {
                    class: [
                        'image-max-width-input'
                    ]
                }
            })

            input.bind( 'value' ).to( command, (value) => {
                return value ? value['max-width'] : null;
            } );

            input.on('input', () => {
                console.log(input);
                this._validateInput(input);
                if (input.hasError) {
                    return input;
                } else if (input.isEmpty) {
                    editor.execute( 'imageMaxWidth', {
                        'max-width': null
                    });
                } else {
                    editor.execute('imageMaxWidth', {
                        'max-width': input.element.value
                    });
                }
            } );

            return input;
        } );
    }

    _validateInput(view) {
        view.set('errorText', null);
        view.set('hasError', false);
        view.set('isEmpty', true);

        if (isNaN(view.element.value)) {
            view.set('errorText', 'Input must be numeric');
            view.set('hasError', true);
        }

        if (view.element.value < 10) {
            view.set('errorText', `Minimum size must be more than 10px`);
            view.set('hasError', true);
        }

        if (view.element.value.length !== 0) {
            view.set('isEmpty', false);
        } else {
            view.set('errorText', null);
            view.set('hasError', false);
            view.set('isEmpty', true);
        }
        return view;
    }
}
