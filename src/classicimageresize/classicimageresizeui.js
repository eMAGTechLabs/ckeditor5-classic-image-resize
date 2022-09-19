import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InputTextView from "@ckeditor/ckeditor5-ui/src/inputtext/inputtextview";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import aspectRatioLockIcon from "../../theme/icons/aspect-ratio-lock.svg";

import '../../theme/classic-image-resize.css';

/**
 * The image style UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ClassicImageResizeUi extends Plugin {
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
        const widthDimension = {
            name: 'width',
            label: 'Width'
        };
        this._createInput( widthDimension );

/*
        const heightDimension = {
            name: 'height',
            label: 'Height'
        }
        this._createInput( heightDimension );
*/

        const aspectRatio = {
            name: 'lockAspectRatio',
            title: 'Lock Aspect Ratio',
            icon: aspectRatioLockIcon
        }
        this._createButton( aspectRatio );
    }


    /**
     * Creates an input for each dimension and stores it in the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
     *
     * @private
     * @param {module:image/imagesize/imagesizeediting} dimension
     */
    _createInput( dimension ) {
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
                        'max-width'
                    ]
                }
            })

            input.bind( 'value' ).to( command, (value) => {
                console.log(value);
                return value ? value['max-width'] : null;
            } );

/*            if (dimension.name === 'height') {
                input.bind( 'isReadOnly' ).to( command , 'isLockedAspectRatio');
            }*/

            input.on('input', () => {
                console.log(input);
                this._validateInput(input, dimension.name);
                if (input.hasError) {
                    return input;
                }

                editor.execute( 'imageMaxWidth', {
                    'max-width': input.element.value
                })
            } );

            return input;
        } );
    }

    _createButton( aspectRatio ) {
        const editor = this.editor;

        const componentName = `imageMaxWidth:${ aspectRatio.name }`;

        editor.ui.componentFactory.add( componentName, locale => {
            const command = editor.commands.get( 'imageMaxWidth' );
            const view = new ButtonView( locale );

            view.set( {
                label: aspectRatio.title,
                icon: aspectRatio.icon,
                tooltip: true,
                isToggleable: true
            } );

            view.bind( 'isEnabled' ).to( command, 'isEnabled' )
            view.bind( 'isOn' ).to( command, 'isLockedAspectRatio');

            this.listenTo( view, 'execute', () => {
                editor.execute( 'imageMaxWidth', {
                    lockAspectRatio: !view.isOn
                } );
                editor.editing.view.focus();
            } );

            return view;
        } );
    }

    _validateInput(view, dimension) {
        view.set('errorText', null);
        view.set('hasError', false);

        if (isNaN(view.element.value)) {
            view.set('errorText', 'Input must be numeric');
            view.set('hasError', true);
        }

        if (view.element.value < 10) {
            view.set('errorText', `Minimum ${dimension.name} size must be more than 10px`);
            view.set('hasError', true);
        }
        return view;
    }
}
